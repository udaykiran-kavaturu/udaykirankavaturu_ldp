import { Body, Controller, ParseIntPipe, Patch, Post, Query, Request } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDTO, UpdateContractDTO } from './dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from 'src/entities';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES } from 'src/swagger';
import { CONTRACTS_SWAGGER_RESPONSES } from 'src/swagger/contracts';
import { GetUser } from 'src/users/get-user.decorator';

@ApiTags('contracts')
@ApiBadRequestResponse({
    example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
    example: COMMON_SWAGGER_RESPONSES.unAuthorized,
})
@ApiForbiddenResponse({ example: COMMON_SWAGGER_RESPONSES.forbidden })
@ApiBearerAuth()
@Controller('contracts')
export class ContractsController {
    constructor(private contractsService: ContractsService) { }

    @ApiOkResponse({ example: CONTRACTS_SWAGGER_RESPONSES.created })
    @Roles(UserType.ADMIN, UserType.LENDER)
    @Post()
    async createContract(
        @Body() createContractDTO: CreateContractDTO,
        @Request() req,
    ) {
        const currentUserID = req.user.sub;
        return await this.contractsService.createContract(
            createContractDTO,
            currentUserID,
        );
    }

    @ApiOkResponse({ example: CONTRACTS_SWAGGER_RESPONSES.updated })
    @ApiNotFoundResponse({ example: CONTRACTS_SWAGGER_RESPONSES.contractNotFound })
    @ApiForbiddenResponse({ example: CONTRACTS_SWAGGER_RESPONSES.forbidden })
    @Roles(UserType.ADMIN, UserType.LENDER)
    @Patch()
    async updateContract(
        @Query('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() updateContractDTO: UpdateContractDTO
    ) {
        const currentUserID = req.user.sub;
        const currentUserType = req.user.type;
        return await this.contractsService.updateContract(id, updateContractDTO, currentUserID, currentUserType);
    }
}
