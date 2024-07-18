import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { CashKick, CashKickContract, Contract, PaymentSchedule } from 'src/entities';
import { CreateCashKickDTO } from './dto';

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

        private dataSource: DataSource
    ) { }

    async createCashKick(createCashKickDTO: CreateCashKickDTO, currentUserID: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Step 1: Get and validate contracts
            const [contracts, contracts_count] = await queryRunner.manager.findAndCount(Contract, {
                where: { id: In(createCashKickDTO.contract_ids) }
            });

            if (contracts_count !== createCashKickDTO.contract_ids.length) {
                throw new HttpException('Invalid contract id', HttpStatus.BAD_REQUEST);
            }

            // Step 2: Create cash kick
            const cashKick = this.cashKicksRepository.create(createCashKickDTO);
            cashKick.created_by = currentUserID;
            cashKick.updated_by = currentUserID;
            cashKick.seeker_id = currentUserID;
            cashKick.total_financed = contracts.reduce((accumulator, contract) => { return accumulator + parseFloat(contract.amount.toString()) }, 0);

            const createdCashKick = await queryRunner.manager.save(CashKick, cashKick);

            // Step 3: Create cash kick contracts
            const cashKickContracts: Partial<CashKickContract>[] = contracts.map(contract => ({
                seeker_id: currentUserID,
                contract_id: contract.id,
                cash_kick_id: createdCashKick,
                created_by: currentUserID,
                updated_by: currentUserID
            }));

            await queryRunner.manager.save(CashKickContract, cashKickContracts);

            // If all operations succeed, commit the transaction
            await queryRunner.commitTransaction();

            return await this.cashKickContractsRepository
                .createQueryBuilder('cashKickContracts')
                .leftJoinAndSelect('cashKickContracts.cash_kick_id', 'cashKick')
                .where('cashKick.id = :id', { id: createdCashKick.id })
                .getOne();
        } catch (err) {
            console.log(err);

            // If any operation fails, rollback the transaction
            await queryRunner.rollbackTransaction();
            throw err; // Rethrow the error to be caught by the caller
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }
}
