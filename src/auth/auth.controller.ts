import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.public-decorator';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { blacklistedTokens } from '../utils/blacklisted.tokens';
import { LoginDTO, RegisterDTO } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES, AUTH_SWAGGER_RESPONSES, AUTH_HEADERS } from 'src/swagger';
@Controller('auth')
@ApiTags('auth')
@ApiBadRequestResponse({ example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse })
@ApiUnauthorizedResponse({ example: COMMON_SWAGGER_RESPONSES.forbiddenResponse })
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiCreatedResponse({ example: AUTH_SWAGGER_RESPONSES.register })
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    async register(@Body() registerDTO: RegisterDTO) {
        try {
            return await this.authService.register(registerDTO);
        } catch (error) {
            throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
        }
    }

    @ApiOkResponse({ example: AUTH_SWAGGER_RESPONSES.login })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() loginDTO: LoginDTO) {
        try {
            return this.authService.logIn(loginDTO.email, loginDTO.password);
        } catch (error) {
            throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
        }
    }

    @ApiOkResponse({ example: AUTH_SWAGGER_RESPONSES.logout })
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Post('logout')
    logOut(@Request() req) {
        try {
            const { token } = req;
            blacklistedTokens.push(token);
            return { "message": "logged out" };
        } catch (error) {
            throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
        }
    }

    // @Roles(Role.Admin)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}