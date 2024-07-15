import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async logIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        try {
            const user = await this.usersService.findOne(username);
            if (!user) {
                throw new UnauthorizedException();
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                throw new UnauthorizedException();
            }
            const payload = {
                sub: user.id,
                username: user.name,
                type: user.type
            };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
        }

    }

    async register(registerDTO: RegisterDTO) {
        try {
            return await this.usersService.create(registerDTO);
        } catch (error) {
            throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
        }
    }
}