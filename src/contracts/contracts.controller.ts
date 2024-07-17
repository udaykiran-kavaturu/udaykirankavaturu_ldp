import { Body, Controller, Post, Request } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDTO } from './dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from 'src/entities';
import { ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES } from 'src/swagger';
import { CONTRACTS_SWAGGER_RESPONSES } from 'src/swagger/contracts';

@ApiTags('contracts')
@ApiBadRequestResponse({
    example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
    example: COMMON_SWAGGER_RESPONSES.unAuthorized,
})
@ApiForbiddenResponse({ example: COMMON_SWAGGER_RESPONSES.forbidden })
@Controller('contracts')
export class ContractsController {

    constructor(private contractsService: ContractsService) { }

    @ApiOkResponse({ example: CONTRACTS_SWAGGER_RESPONSES.contractCreated })
    @ApiBearerAuth()
    @Roles(UserType.ADMIN, UserType.LENDER)
    @Post()
    async createContract(@Body() createContractDTO: CreateContractDTO, @Request() req) {
        const userID = req.user.sub;
        return await this.contractsService.createContract(createContractDTO, userID);
    }
}
