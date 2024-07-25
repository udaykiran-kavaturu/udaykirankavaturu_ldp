import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { JWTConstants } from './auth.constants';
import { IS_PUBLIC_KEY } from './auth.public-decorator';
import { blacklistedTokens } from '../utils/blacklisted-tokens';
import { UserType } from '../entities';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    if (blacklistedTokens.includes(token)) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: JWTConstants.secret,
    });

    request['user'] = payload;
    request['token'] = token;

    if (
      request.user.sub !== Number(request.query.id) &&
      request.user.type != UserType.ADMIN
    ) {
      throw new ForbiddenException(
        'you can only view or update your own profile',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
