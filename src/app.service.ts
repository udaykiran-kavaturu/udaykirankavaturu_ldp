import { Injectable } from '@nestjs/common';
import { HEALTH_CHECK_RESPONSE } from './utils/constants';

@Injectable()
export class AppService {
  checkHealth(): { message: string } {
    return HEALTH_CHECK_RESPONSE;
  }
}
