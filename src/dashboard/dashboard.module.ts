import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {
  Contract,
  CashKick,
  CashKickContract,
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
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
