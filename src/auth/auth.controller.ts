import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.public-decorator';
import { blacklistedTokens } from '../utils/blacklisted-tokens';
import { LoginDTO, RegisterDTO } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES, AUTH_SWAGGER_RESPONSES } from '../swagger';
@Controller('auth')
@ApiTags('auth')
@ApiBadRequestResponse({
  example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
  example: COMMON_SWAGGER_RESPONSES.forbiddenResponse,
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiCreatedResponse({ example: AUTH_SWAGGER_RESPONSES.register })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDTO: RegisterDTO) {
    return await this.authService.register(registerDTO);
  }

  @ApiOkResponse({ example: AUTH_SWAGGER_RESPONSES.login })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() loginDTO: LoginDTO) {
    return this.authService.logIn(loginDTO.email, loginDTO.password);
  }

  @ApiOkResponse({ example: AUTH_SWAGGER_RESPONSES.logout })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Post('logout')
  logOut(@Request() req) {
    const { token } = req;
    blacklistedTokens.push(token);
    return { message: 'logged out' };
  }

  // @Roles(Role.Admin)
  // @Get('profile')
  // getProfile(@Request() req) {
  //     return req.user;
  // }
}
