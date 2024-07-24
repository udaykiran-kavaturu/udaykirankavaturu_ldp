import { Controller, Get, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { UserType } from '../entities';
import { Roles } from '../auth/roles.decorator';
import {
  COMMON_SWAGGER_RESPONSES,
  DASHBOARD_SWAGGER_RESPONSES,
} from '../swagger';

@ApiTags('dashboard')
@ApiBadRequestResponse({
  example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse,
})
@ApiUnauthorizedResponse({
  example: COMMON_SWAGGER_RESPONSES.unAuthorized,
})
@ApiForbiddenResponse({ example: COMMON_SWAGGER_RESPONSES.forbidden })
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @ApiOkResponse({ example: DASHBOARD_SWAGGER_RESPONSES.getDashboardMetrics })
  @Roles(UserType.ADMIN, UserType.SEEKER)
  @Get()
  async getDashboardMetrics(@Request() req) {
    const currentUserID = req.user.sub;
    return await this.dashboardService.getDashboardMetrics(currentUserID);
  }
}
