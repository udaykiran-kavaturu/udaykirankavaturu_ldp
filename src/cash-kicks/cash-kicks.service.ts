import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Repository, In, DataSource } from 'typeorm';

import {
  CashKick,
  CashKickContract,
  CashKickContractStatus,
  CashKickStatus,
  Contract,
  PaymentSchedule,
  User,
  UserType,
} from '../entities';
import {
  CreateCashKickDTO,
  UpdateCashKickContractDTO,
  UpdateScheduleDTO,
} from './dto';

@Injectable()
export class CashKicksService {
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

    @InjectDataSource()
    private dataSource: DataSource,
  ) { }

  async createCashKick(
    createCashKickDTO: CreateCashKickDTO,
    currentUserID: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: Get and validate contracts
      const [contracts, contracts_count] =
        await queryRunner.manager.findAndCount(Contract, {
          where: { id: In(createCashKickDTO.contract_ids) },
        });

      if (contracts_count !== createCashKickDTO.contract_ids.length) {
        throw new HttpException('Invalid contract id', HttpStatus.BAD_REQUEST);
      }

      // Step 2: Create cash kick
      const cashKick = this.cashKicksRepository.create(createCashKickDTO);
      cashKick.created_by = currentUserID;
      cashKick.updated_by = currentUserID;
      cashKick.seeker_id = currentUserID;
      cashKick.total_financed = contracts.reduce((accumulator, contract) => {
        return accumulator + parseFloat(contract.amount.toString());
      }, 0);

      const userDetails = await this.userRepository.findOne({
        where: { id: currentUserID },
      });
      if (userDetails.credit_balance < cashKick.total_financed) {
        throw new HttpException(
          'insufficient credit balance',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdCashKick = await queryRunner.manager.save(
        CashKick,
        cashKick,
      );

      // Step 3: Create cash kick contracts
      const cashKickContracts: Partial<CashKickContract>[] = contracts.map(
        (contract) => ({
          seeker_id: currentUserID,
          contract_id: contract.id,
          cash_kick_id: createdCashKick,
          created_by: currentUserID,
          updated_by: currentUserID,
        }),
      );

      await queryRunner.manager.save(CashKickContract, cashKickContracts);

      // If all operations succeed, commit the transaction
      await queryRunner.commitTransaction();

      return await this.cashKickContractsRepository
        .createQueryBuilder('cashKickContracts')
        .leftJoinAndSelect('cashKickContracts.cash_kick_id', 'cashKick')
        .where('cashKick.id = :id', { id: createdCashKick.id })
        .getOne();
    } catch (error) {
      // If any operation fails, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error; // Rethrow the error to be caught by the caller
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async updateCashKickContract(
    cashKickId: number,
    contractId: number,
    updateCashKickContractDTO: UpdateCashKickContractDTO,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cashKickContract = await queryRunner.manager.findOne(
        CashKickContract,
        {
          where: {
            cash_kick_id: { id: cashKickId },
            contract_id: contractId,
          },
        },
      );
      if (!cashKickContract) {
        throw new HttpException('contract not found', HttpStatus.NOT_FOUND);
      }
      const contract = await this.contractsRepository.findOne({
        where: { id: cashKickContract.contract_id },
      });

      if (
        contract.lender_id != currentUserID &&
        currentUserType != UserType.ADMIN
      ) {
        throw new ForbiddenException(
          'you can only view or update your own contract',
        );
      }

      if (cashKickContract.status == updateCashKickContractDTO.status) {
        throw new HttpException(
          'cash kick contract is already in given status',
          HttpStatus.BAD_REQUEST,
        );
      }

      // update cash kick contract status
      await queryRunner.manager.update(
        CashKickContract,
        { cash_kick_id: { id: cashKickId }, contract_id: contractId },
        { status: updateCashKickContractDTO.status, updated_by: currentUserID },
      );

      if (updateCashKickContractDTO.status == CashKickContractStatus.ACTIVE) {
        const nextDueDate = new Date();
        nextDueDate.setDate(contract.scheduled_due_date);

        // create payment schedule
        for (let i = 1; i <= 12; i++) {
          const schedule: Partial<PaymentSchedule> = {
            seeker_id: cashKickContract.seeker_id,
            lender_id: contract.lender_id,
            cash_kick_id: cashKickId,
            contract_id: cashKickContract.contract_id,
            amount: contract.amount / 12,
            due_date: nextDueDate,
            created_by: currentUserID,
            updated_by: currentUserID,
          };

          // Move to the next month's start date for the next iteration
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          nextDueDate.setDate(contract.scheduled_due_date);

          await queryRunner.manager.save(PaymentSchedule, schedule);
        }

        // update maturity date for the cash kick
        const schedule = await this.paymentScheduleRepository
          .createQueryBuilder('schedule')
          .where({ cash_kick_id: cashKickId })
          .select('MAX(schedule.due_date)', 'maxDate')
          .getRawOne();

        await queryRunner.manager.update(
          CashKick,
          { id: cashKickId },
          {
            maturity_date: schedule.maxDate,
            status: CashKickStatus.ACTIVE,
            updated_by: currentUserID,
          },
        );

        const userDetails = await this.userRepository.findOne({
          where: { id: cashKickContract.seeker_id },
        });
        const newBalance = userDetails.credit_balance - contract.amount;

        // reduce amount from seeker balance
        await queryRunner.manager.update(
          User,
          { id: cashKickContract.seeker_id },
          { credit_balance: newBalance, updated_by: currentUserID },
        );
      }

      // If all operations succeed, commit the transaction
      await queryRunner.commitTransaction();

      return await this.cashKickContractsRepository.findOne({
        where: {
          cash_kick_id: { id: cashKickId },
          contract_id: contractId,
        },
      });
    } catch (error) {
      // If any operation fails, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error; // Rethrow the error to be caught by the caller
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async updateSchedule(
    cashKickId: number,
    contractId: number,
    scheduleId: number,
    updateScheduleDTO: UpdateScheduleDTO,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const schedule = await this.paymentScheduleRepository.findOne({
      where: {
        id: scheduleId,
        cash_kick_id: cashKickId,
        contract_id: contractId,
      },
    });

    if (!schedule) {
      throw new HttpException('schedule entry not found', HttpStatus.NOT_FOUND);
    }

    if (
      schedule.seeker_id != currentUserID &&
      currentUserType != UserType.ADMIN
    ) {
      throw new ForbiddenException(
        'you can only view or update your own schedule entries',
      );
    }

    if (schedule.status == updateScheduleDTO.status) {
      throw new HttpException(
        'schedule entry is already in given status',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.paymentScheduleRepository.update(
      { id: scheduleId },
      { status: updateScheduleDTO.status },
    );
    return await this.paymentScheduleRepository.findOne({
      where: { id: scheduleId },
    });
  }

  async getCashKickById(
    id: number,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const cashKick = await this.cashKicksRepository.findOne({
      where: { id },
    });
    if (!cashKick)
      throw new HttpException('cash kick not found', HttpStatus.NOT_FOUND);

    if (
      cashKick.seeker_id != currentUserID &&
      currentUserType != UserType.ADMIN
    )
      throw new ForbiddenException(
        'you can only view or update your own cash kick',
      );

    return cashKick;
  }

  async getAllCashKicks(
    page: number = 1,
    limit: number = 10,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const skip = (page - 1) * limit;

    const [cashKicks, total] = await this.cashKicksRepository.findAndCount({
      skip: skip,
      take: limit,
      where: {
        seeker_id: currentUserType == UserType.SEEKER ? currentUserID : null,
      },
    });

    if (total == 0)
      throw new HttpException('no cash kicks found', HttpStatus.NOT_FOUND);

    return {
      data: cashKicks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
