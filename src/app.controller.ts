import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.public-decorator';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { COMMON_SWAGGER_RESPONSES } from './swagger';

@ApiTags('health-check')
@ApiBadRequestResponse({ example: COMMON_SWAGGER_RESPONSES.apiBadRequestResponse })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOkResponse({ example: COMMON_SWAGGER_RESPONSES.healthCheckResponse })
  @Get('/health-check')
  @Public()
  checkHealth(): { "message": string } {
    try {
      return this.appService.checkHealth();
    } catch (error) {
      throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
    }
  }
}
