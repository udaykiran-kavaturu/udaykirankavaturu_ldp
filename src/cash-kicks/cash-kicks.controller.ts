import { Body, Controller, Post, Request } from '@nestjs/common';
import { CashKicksService } from './cash-kicks.service';
import { CreateCashKickDTO } from './dto';
import { ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth } from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES } from 'src/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from 'src/entities';

@ApiTags('cash-kicks')
@ApiBadRequestResponse({
    example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
    example: COMMON_SWAGGER_RESPONSES.unAuthorized,
})
@ApiForbiddenResponse({ example: COMMON_SWAGGER_RESPONSES.forbidden })
@ApiBearerAuth()
@Controller('cash-kicks')
export class CashKicksController {
    constructor(private cashKicksService: CashKicksService) { }

    @Post()
    @Roles(UserType.ADMIN, UserType.SEEKER)
    async createCashKick(
        @Body() createCashKickDTO: CreateCashKickDTO,
        @Request() req
    ) {
        const currentUserID = req.user.sub;
        return await this.cashKicksService.createCashKick(createCashKickDTO, currentUserID);
    }
}
