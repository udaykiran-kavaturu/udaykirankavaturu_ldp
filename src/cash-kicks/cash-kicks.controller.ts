import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CashKicksService } from './cash-kicks.service';
import {
  CreateCashKickDTO,
  UpdateCashKickContractDTO,
  UpdateScheduleDTO,
} from './dto';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CASH_KICKS_SWAGGER_RESPONSES,
  COMMON_SWAGGER_RESPONSES,
} from '../swagger';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../entities';

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

  @ApiOkResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.created })
  @Post()
  @Roles(UserType.ADMIN, UserType.SEEKER)
  async createCashKick(
    @Body() createCashKickDTO: CreateCashKickDTO,
    @Request() req,
  ) {
    const currentUserID = req.user.sub;
    return await this.cashKicksService.createCashKick(
      createCashKickDTO,
      currentUserID,
    );
  }

  @ApiOkResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.updated })
  @ApiNotFoundResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.notFound })
  @Patch(':cashKickId/cash-kick-contracts/:contractId')
  @Roles(UserType.ADMIN, UserType.LENDER)
  async updateCashKickContract(
    @Param('cashKickId') cashKickId: number,
    @Param('contractId') contractId: number,
    @Body() updateCashKickContractDTO: UpdateCashKickContractDTO,
    @Request() req,
  ) {
    const currentUserID = req.user.sub;
    const currentUserType = req.user.type;
    return await this.cashKicksService.updateCashKickContract(
      cashKickId,
      contractId,
      updateCashKickContractDTO,
      currentUserID,
      currentUserType,
    );
  }

  @ApiOkResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.scheduleUpdated })
  @ApiNotFoundResponse({
    example: CASH_KICKS_SWAGGER_RESPONSES.scheduleNotFound,
  })
  @Patch(':cashKickId/cash-kick-contracts/:contractId/schedule/:scheduleId')
  @Roles(UserType.ADMIN, UserType.SEEKER)
  async updateSchedule(
    @Param('cashKickId') cashKickId: number,
    @Param('contractId') contractId: number,
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleDTO: UpdateScheduleDTO,
    @Request() req,
  ) {
    const currentUserID = req.user.sub;
    const currentUserType = req.user.type;
    return await this.cashKicksService.updateSchedule(
      cashKickId,
      contractId,
      scheduleId,
      updateScheduleDTO,
      currentUserID,
      currentUserType,
    );
  }

  @ApiOkResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.getCashKicks })
  @ApiForbiddenResponse({ example: CASH_KICKS_SWAGGER_RESPONSES.forbidden })
  @ApiNotFoundResponse({
    example: CASH_KICKS_SWAGGER_RESPONSES.cashKickNotFound,
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(UserType.ADMIN, UserType.SEEKER)
  @Get()
  async getCashKicks(
    @Query('id') id?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req?,
  ) {
    const currentUserID = req.user.sub;
    const currentUserType = req.user.type;

    if (id) {
      return await this.cashKicksService.getCashKickById(
        id,
        currentUserID,
        currentUserType,
      );
    } else {
      return await this.cashKicksService.getAllCashKicks(
        page,
        limit,
        currentUserID,
        currentUserType,
      );
    }
  }
}
