import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto';
import { COMMON_SWAGGER_RESPONSES, USER_SWAGGER_RESPONSES } from '../swagger';

@ApiTags('users')
@ApiBadRequestResponse({
  example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
  example: COMMON_SWAGGER_RESPONSES.unAuthorized,
})
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiForbiddenResponse({ example: USER_SWAGGER_RESPONSES.forbidden })
  @ApiOkResponse({ example: USER_SWAGGER_RESPONSES.patchUser })
  @ApiNotFoundResponse({ example: USER_SWAGGER_RESPONSES.userNotFound })
  @Patch()
  async updateUser(
    @Query('id', ParseIntPipe) id: number,
    @Body() updateUserDTO: UpdateUserDTO,
    @Request() req,
  ) {
    return await this.usersService.update(id, updateUserDTO, req);
  }

  @ApiForbiddenResponse({ example: USER_SWAGGER_RESPONSES.forbidden })
  @ApiOkResponse({ example: USER_SWAGGER_RESPONSES.getUser })
  @ApiNotFoundResponse({ example: USER_SWAGGER_RESPONSES.userNotFound })
  @Get()
  async getUser(@Query('id', ParseIntPipe) id: number) {
    return await this.usersService.findOneByID(id);
  }
}
