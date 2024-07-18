import { Module } from '@nestjs/common';
import { CashKicksController } from './cash-kicks.controller';
import { CashKicksService } from './cash-kicks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashKick, CashKickContract, Contract, PaymentSchedule } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, CashKick, CashKickContract, PaymentSchedule])],
  controllers: [CashKicksController],
  providers: [CashKicksService],
})
export class CashKicksModule { }
