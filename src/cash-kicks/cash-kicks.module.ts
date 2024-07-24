import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CashKicksController } from './cash-kicks.controller';
import { CashKicksService } from './cash-kicks.service';
import {
  CashKick,
  CashKickContract,
  Contract,
  PaymentSchedule,
  User,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      CashKick,
      CashKickContract,
      PaymentSchedule,
      User,
    ]),
  ],
  controllers: [CashKicksController],
  providers: [CashKicksService],
})
export class CashKicksModule {}
