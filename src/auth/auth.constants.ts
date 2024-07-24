import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export const JWTConstants = {
  secret: configService.get('TERCES_YEK'),
};
