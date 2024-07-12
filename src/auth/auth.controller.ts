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
import { LoginDTO } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() loginDTO: LoginDTO) {
        return this.authService.logIn(loginDTO.email, loginDTO.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logOut(@Request() req) {
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