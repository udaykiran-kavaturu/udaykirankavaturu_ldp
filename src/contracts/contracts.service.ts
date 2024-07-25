import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateContractDTO } from './dto';
import { Contract, UserType } from '../entities';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}

  async createContract(
    createContractDTO: CreateContractDTO,
    currentUserID: number,
  ) {
    const newContract = this.contractsRepository.create(createContractDTO);
    newContract.created_by = currentUserID;
    newContract.lender_id = currentUserID;
    return await this.contractsRepository.save(newContract);
  }

  async updateContract(
    id: number,
    contract: Partial<Contract>,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const contractDetails = await this.contractsRepository.findOne({
      where: { id },
    });
    if (!contractDetails)
      throw new HttpException('contract not found', HttpStatus.NOT_FOUND);

    if (
      contractDetails.lender_id != currentUserID &&
      currentUserType != UserType.ADMIN
    )
      throw new ForbiddenException(
        'you can only view or update your own contract',
      );

    contract.updated_by = currentUserID;
    await this.contractsRepository.update(id, contract);
    return await this.contractsRepository.findOne({
      where: { id },
      select: {
        id: true,
        amount: true,
        fee: true,
        name: true,
        status: true,
        type: true,
        scheduled_due_date: true,
      },
    });
  }

  async getContractById(
    id: number,
    currentUserID: number,
    currentUserType: UserType,
  ) {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      select: {
        id: true,
        amount: true,
        fee: true,
        name: true,
        status: true,
        type: true,
        scheduled_due_date: true,
      },
    });
    if (!contract)
      throw new HttpException('contract not found', HttpStatus.NOT_FOUND);

    if (
      contract.lender_id != currentUserID &&
      currentUserType != UserType.ADMIN
    )
      throw new ForbiddenException(
        'you can only view or update your own contract',
      );

    return contract;
  }

  async getAllContracts(
    currentUserID: number,
    currentUserType: UserType,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [contracts, total] = await this.contractsRepository.findAndCount({
      skip: skip,
      take: limit,
      where: {
        lender_id: currentUserType == UserType.LENDER ? currentUserID : null,
      },
    });

    if (total == 0)
      throw new HttpException('no contracts found', HttpStatus.NOT_FOUND);

    return {
      data: contracts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
