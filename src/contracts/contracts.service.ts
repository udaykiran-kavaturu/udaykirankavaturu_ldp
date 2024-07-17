import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateContractDTO } from './dto';
import { Contract, UserType } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const newContract =
      await this.contractsRepository.create(createContractDTO);
    newContract.created_by = currentUserID;
    newContract.lender_id = currentUserID;
    return await this.contractsRepository.save(newContract);
  }

  async updateContract(
    id: number,
    contract: Partial<Contract>,
    currentUserID: number,
    currentUserType: string,
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
        'You can only view or update your own contract',
      );

    contract.updated_by = currentUserID;
    await this.contractsRepository.update(id, contract);
    return await this.contractsRepository.findOne({ where: { id } });
  }
}
