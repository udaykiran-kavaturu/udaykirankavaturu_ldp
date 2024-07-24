import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
  CashKickContractStatus,
  PaymentScheduleStatus,
} from '../entities';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,

    @InjectRepository(CashKick)
    private cashKicksRepository: Repository<CashKick>,

    @InjectRepository(CashKickContract)
    private cashKickContractsRepository: Repository<CashKickContract>,

    @InjectRepository(PaymentSchedule)
    private paymentScheduleRepository: Repository<PaymentSchedule>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getDashboardMetrics(currentUserID: number) {
    const response = {
      term_cap: 12,
      credit_balance: null,
      max_interest_rate: null,
      outstanding_amount: null,
      next_due_date: null,
    };

    const userDetails = await this.userRepository.findOne({
      where: { id: currentUserID },
    });

    response.credit_balance = userDetails.credit_balance;

    const activeContracts = await this.cashKickContractsRepository.find({
      where: {
        seeker_id: currentUserID,
        status: CashKickContractStatus.ACTIVE,
      },
    });
    if (activeContracts.length) {
      const contractIds = activeContracts.map(
        (contract) => contract.contract_id,
      );
      const contract = await this.contractsRepository
        .createQueryBuilder('contract')
        .where('contract.id IN (:...ids)', { ids: contractIds })
        .select('MAX(contract.fee)', 'maxFee')
        .getRawOne();

      if (contract) response.max_interest_rate = contract.maxFee;

      const schedule = await this.paymentScheduleRepository
        .createQueryBuilder('schedule')
        .select('SUM(schedule.amount)', 'totalOutstandingAmount')
        .addSelect('MIN(schedule.due_date)', 'nextDueDate')
        .where('schedule.status = :status', {
          status: PaymentScheduleStatus.PENDING,
        })
        .andWhere('schedule.seeker_id = :seeker_id', {
          seeker_id: currentUserID,
        })
        .getRawOne();

      if (schedule) {
        response.outstanding_amount = schedule.totalOutstandingAmount;
        response.next_due_date = schedule.nextDueDate;
      }
    }

    return response;
  }
}
