import { Body, Controller, Param, Patch, Post, Request } from '@nestjs/common';
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
} from '@nestjs/swagger';
import {
  CASH_KICKS_SWAGGER_RESPONSES,
  COMMON_SWAGGER_RESPONSES,
} from 'src/swagger';
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
  constructor(private cashKicksService: CashKicksService) {}

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
}