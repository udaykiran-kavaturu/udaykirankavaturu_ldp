import {
    Body,
    Controller,
    ForbiddenException,
    ParseIntPipe,
    Patch,
    Query,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto';
import { GetUser } from './get-user.decorator';
import { ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES, USER_SWAGGER_RESPONSES } from 'src/swagger';

@ApiTags('users')
@ApiBadRequestResponse({
    example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
    example: COMMON_SWAGGER_RESPONSES.forbiddenResponse,
})
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @ApiForbiddenResponse({ example: USER_SWAGGER_RESPONSES.forbidden })
    @ApiOkResponse({ example: USER_SWAGGER_RESPONSES.patch })
    @Patch()
    async updateUser(
        @Query('id', ParseIntPipe) id: number,
        @Body() updateUserDTO: UpdateUserDTO,
        @GetUser() currentUser: any,
        @Request() req
    ) {
        if (currentUser.sub !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }

        return await this.userService.update(id, updateUserDTO, req);
    }
}
