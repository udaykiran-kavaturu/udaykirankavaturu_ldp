import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): { "message": string } {
    try {
      return { "message": "ok" };
    } catch (error) {
      throw new BadRequestException('Something went wrong', { cause: new Error(), description: error.message });
    }
  }
}
