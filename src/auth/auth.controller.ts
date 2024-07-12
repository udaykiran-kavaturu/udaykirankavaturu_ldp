import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.public-decorator';
import { Role } from 'src/enums/role.enum';
import { Roles } from './roles.decorator';
import { blacklistedTokens } from 'src/utils/blacklisted.tokens';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    signOut(@Body() signInDto: Record<string, any>, @Request() req) {
        const { token } = req;
        blacklistedTokens.push(token);
        return { "message": "logged out" };
    }

    @Roles(Role.Admin)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}