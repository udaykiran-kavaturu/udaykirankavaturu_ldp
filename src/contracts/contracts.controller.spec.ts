import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ContractsController } from './contracts.controller';
import { Contract, ContractType, UserType } from '../entities';
import { ContractsService } from './contracts.service';
import { CreateContractDTO, UpdateContractDTO } from './dto';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
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

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContract', () => {
    it('should call service with correct params', async () => {
      const createContractDTO: CreateContractDTO = {
        // add properties here
        name: 'name',
        type: ContractType.MONTHLY,
        amount: 10000,
        fee: 12.5,
        scheduled_due_date: 1,
      };
      const req = { user: { sub: 1, type: UserType.LENDER } };

      jest.spyOn(service, 'createContract').mockImplementation(() =>
        Promise.resolve({
          ...createContractDTO,
          id: 1,
          lender_id: 1,
          created_at: new Date(),
          created_by: 1,
          status: 1,
          updated_at: new Date(),
          updated_by: 1,
        }),
      );

      await controller.createContract(createContractDTO, req);

      expect(service.createContract).toHaveBeenCalledWith(
        createContractDTO,
        req.user.sub,
      );
    });
  });

  describe('updateContract', () => {
    it('should call service with correct params', async () => {
      const id = 1;
      const updateContractDTO: UpdateContractDTO = {
        // add properties here
        amount: 10000,
        fee: 12.5,
        scheduled_due_date: 1,
        name: 'name',
        type: ContractType.MONTHLY,
      };
      const req = { user: { sub: 1, type: UserType.LENDER } };

      jest.spyOn(service, 'updateContract').mockImplementation(() =>
        Promise.resolve({
          ...updateContractDTO,
          id: 1,
          lender_id: 1,
          created_at: new Date(),
          created_by: 1,
          status: 1,
          updated_at: new Date(),
          updated_by: 1,
        }),
      );

      await controller.updateContract(id, req, updateContractDTO);

      expect(service.updateContract).toHaveBeenCalledWith(
        id,
        updateContractDTO,
        req.user.sub,
        req.user.type,
      );
    });
  });

  describe('getContracts', () => {
    it('should call service with correct params when id is provided', async () => {
      const id = 1;
      const req = { user: { sub: 1, type: UserType.LENDER } };

      const contract: CreateContractDTO = {
        // add properties here
        name: 'name',
        type: ContractType.MONTHLY,
        amount: 10000,
        fee: 12.5,
        scheduled_due_date: 1,
      };

      jest.spyOn(service, 'getContractById').mockImplementation(() =>
        Promise.resolve({
          ...contract,
          id: 1,
          lender_id: 1,
          created_at: new Date(),
          created_by: 1,
          status: 1,
          updated_at: new Date(),
          updated_by: 1,
        }),
      );

      await controller.getContracts(id, undefined, undefined, req);

      expect(service.getContractById).toHaveBeenCalledWith(
        id,
        req.user.sub,
        req.user.type,
      );
    });

    it('should call service with correct params when id is not provided', async () => {
      const page = 1;
      const limit = 10;
      const req = { user: { sub: 1, type: UserType.LENDER } };

      const contract: CreateContractDTO = {
        // add properties here
        name: 'name',
        type: ContractType.MONTHLY,
        amount: 10000,
        fee: 12.5,
        scheduled_due_date: 1,
      };

      jest.spyOn(service, 'getAllContracts').mockImplementation(() =>
        Promise.resolve({
          data: [
            {
              ...contract,
              id: 1,
              lender_id: 1,
              created_at: new Date(),
              created_by: 1,
              status: 1,
              updated_at: new Date(),
              updated_by: 1,
            },
          ],
          meta: { total: 1, page: 1, limit: 1, totalPages: 1 },
        }),
      );

      await controller.getContracts(undefined, page, limit, req);

      expect(service.getAllContracts).toHaveBeenCalledWith(
        page,
        limit,
        req.user.sub,
        req.user.type,
      );
    });
  });
});
