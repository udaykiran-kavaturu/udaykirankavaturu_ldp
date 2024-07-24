import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { ContractsService } from './contracts.service';
import { CreateContractDTO, UpdateContractDTO } from './dto';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../entities';
import { COMMON_SWAGGER_RESPONSES } from '../swagger';
import { CONTRACTS_SWAGGER_RESPONSES } from '../swagger/contracts';

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
  @ApiNotFoundResponse({
    example: CONTRACTS_SWAGGER_RESPONSES.contractNotFound,
  })
  @ApiForbiddenResponse({ example: CONTRACTS_SWAGGER_RESPONSES.forbidden })
  @Roles(UserType.ADMIN, UserType.LENDER)
  @Patch()
  async updateContract(
    @Query('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateContractDTO: UpdateContractDTO,
  ) {
    const currentUserID = req.user.sub;
    const currentUserType = req.user.type;
    return await this.contractsService.updateContract(
      id,
      updateContractDTO,
      currentUserID,
      currentUserType,
    );
  }

  @ApiOkResponse({ example: CONTRACTS_SWAGGER_RESPONSES.getContracts })
  @ApiNotFoundResponse({
    example: CONTRACTS_SWAGGER_RESPONSES.contractNotFound,
  })
  @ApiForbiddenResponse({ example: CONTRACTS_SWAGGER_RESPONSES.forbidden })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async getContracts(
    @Query('id') id?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req?,
  ) {
    const currentUserID = req.user.sub;
    const currentUserType = req.user.type;

    if (id) {
      return await this.contractsService.getContractById(
        id,
        currentUserID,
        currentUserType,
      );
    } else {
      return await this.contractsService.getAllContracts(
        page,
        limit,
        currentUserID,
        currentUserType,
      );
    }
  }
}
