import { Injectable } from '@nestjs/common';
import { CreateContractDTO } from './dto';
import { Contract } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractsService {

    constructor(
        @InjectRepository(Contract)
        private contractsRepository: Repository<Contract>,
    ) { }

    async createContract(createContractDTO: CreateContractDTO, userID: number) {
        const newContract = await this.contractsRepository.create(createContractDTO);
        newContract.created_by = userID;
        newContract.lender_id = userID;
        return await this.contractsRepository.save(newContract);
    }
}
