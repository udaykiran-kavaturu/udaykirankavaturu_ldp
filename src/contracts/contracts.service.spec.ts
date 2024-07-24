import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, HttpException } from '@nestjs/common';

import { ContractsService } from './contracts.service';
import { Contract } from '../entities';
import { ContractsController } from './contracts.controller';
import { UserType } from '../entities';

describe('ContractsService', () => {
  let service: ContractsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockRepository,
        },
        {
          provide: 'DataSource',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createContract', () => {
    it('should create a new contract', async () => {
      const createContractDTO: any = {
        // add properties here
      };
      const currentUserID = 1;

      mockRepository.create.mockReturnValueOnce(createContractDTO);
      mockRepository.save.mockResolvedValueOnce({ id: 1 });

      expect(
        await service.createContract(createContractDTO, currentUserID),
      ).toEqual({ id: 1 });
    });
  });

  describe('updateContract', () => {
    it('should update an existing contract', async () => {
      const id = 1;
      const contract: Partial<Contract> = {
        // add properties here
      };
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findOne.mockResolvedValueOnce({ id: 1 });
      mockRepository.update.mockResolvedValueOnce({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce({ id: 1 });

      expect(
        await service.updateContract(
          id,
          contract,
          currentUserID,
          currentUserType,
        ),
      ).toEqual({ id: 1 });
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const id = 1;
      const contract: Partial<Contract> = {
        // add properties here
      };
      const currentUserID = 1;
      const currentUserType = UserType.LENDER;

      mockRepository.findOne.mockResolvedValueOnce({ id: 1, lender_id: 2 });

      await expect(
        service.updateContract(id, contract, currentUserID, currentUserType),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw HttpException if contract not found', async () => {
      const id = 1;
      const contract: Partial<Contract> = {
        // add properties here
      };
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateContract(id, contract, currentUserID, currentUserType),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if contract not found', async () => {
      const id = 1;
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.getContractById(id, currentUserID, currentUserType),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getContractById', () => {
    it('should get a contract by id', async () => {
      const id = 1;
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findOne.mockResolvedValueOnce({ id: 1 });

      expect(
        await service.getContractById(id, currentUserID, currentUserType),
      ).toEqual({ id: 1 });
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const id = 1;
      const currentUserID = 1;
      const currentUserType = UserType.LENDER;

      mockRepository.findOne.mockResolvedValueOnce({ id: 1, lender_id: 2 });

      await expect(
        service.getContractById(id, currentUserID, currentUserType),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getAllContracts', () => {
    it('should get all contracts', async () => {
      const page = 1;
      const limit = 10;
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findAndCount.mockResolvedValueOnce([[{ id: 1 }], 1]);

      expect(
        await service.getAllContracts(
          page,
          limit,
          currentUserID,
          currentUserType,
        ),
      ).toEqual({
        data: [{ id: 1 }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should throw HttpException if no contracts found', async () => {
      const page = 1;
      const limit = 10;
      const currentUserID = 1;
      const currentUserType = UserType.ADMIN;

      mockRepository.findAndCount.mockResolvedValueOnce([[], 0]);

      await expect(
        service.getAllContracts(page, limit, currentUserID, currentUserType),
      ).rejects.toThrow(HttpException);
    });
  });
});
