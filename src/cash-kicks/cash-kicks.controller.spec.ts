import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { CashKicksController } from './cash-kicks.controller';
import { CashKicksService } from './cash-kicks.service';
import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
  UserType,
  CashKickContractStatus,
  PaymentScheduleStatus,
  CashKickStatus,
} from '../entities';
describe('CashKicksController', () => {
  let controller: CashKicksController;
  let service: CashKicksService;

  const mockUser = {
    sub: 1,
    type: UserType.LENDER,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashKicksController],
      providers: [
        CashKicksService,
        { provide: getRepositoryToken(Contract), useValue: mockRepository },
        { provide: getRepositoryToken(CashKick), useValue: mockRepository },
        {
          provide: getRepositoryToken(CashKickContract),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PaymentSchedule),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockRepository },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CashKicksController>(CashKicksController);
    service = module.get<CashKicksService>(CashKicksService);

    jest.spyOn(service, 'createCashKick').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        cash_kick_id: 1,
        contract_id: 1,
        created_at: new Date(),
        created_by: 1,
        seeker_id: 1,
        status: CashKickContractStatus.PENDING,
        updated_at: new Date(),
        updated_by: 1,
      }),
    );
    jest.spyOn(service, 'updateCashKickContract').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        cash_kick_id: 1,
        contract_id: 1,
        created_at: new Date(),
        created_by: 1,
        seeker_id: 1,
        status: CashKickContractStatus.PENDING,
        updated_at: new Date(),
        updated_by: 1,
      }),
    );
    jest.spyOn(service, 'updateSchedule').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        amount: 100,
        cash_kick_id: 1,
        contract_id: 1,
        created_at: new Date(),
        created_by: 1,
        due_date: new Date(),
        lender_id: 1,
        seeker_id: 1,
        status: PaymentScheduleStatus.PENDING,
        updated_at: new Date(),
        updated_by: 1,
      }),
    );
    jest.spyOn(service, 'getCashKickById').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        created_at: new Date(),
        created_by: 1,
        maturity_date: new Date(),
        name: 'name',
        seeker_id: 1,
        status: CashKickStatus.PENDING,
        updated_at: new Date(),
        updated_by: 1,
        total_financed: 100,
        total_received: 100,
      }),
    );
    jest.spyOn(service, 'getAllCashKicks').mockImplementation(() =>
      Promise.resolve({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 10 },
      }),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCashKick', () => {
    it('should call service with correct params', async () => {
      const createCashKickDTO: any = {
        // add properties here
      };
      const req = { user: mockUser };

      await controller.createCashKick(createCashKickDTO, req);

      expect(service.createCashKick).toHaveBeenCalledWith(
        createCashKickDTO,
        req.user.sub,
      );
    });
  });

  describe('updateCashKickContract', () => {
    it('should call service with correct params', async () => {
      const cashKickId = 1;
      const contractId = 1;
      const updateCashKickContractDTO: any = {
        // add properties here
      };
      const req = { user: mockUser };

      await controller.updateCashKickContract(
        cashKickId,
        contractId,
        updateCashKickContractDTO,
        req,
      );

      expect(service.updateCashKickContract).toHaveBeenCalledWith(
        cashKickId,
        contractId,
        updateCashKickContractDTO,
        req.user.sub,
        req.user.type,
      );
    });
  });

  describe('updateSchedule', () => {
    it('should call service with correct params', async () => {
      const cashKickId = 1;
      const contractId = 1;
      const scheduleId = 1;
      const updateScheduleDTO: any = {
        // add properties here
      };
      const req = { user: mockUser };

      await controller.updateSchedule(
        cashKickId,
        contractId,
        scheduleId,
        updateScheduleDTO,
        req,
      );

      expect(service.updateSchedule).toHaveBeenCalledWith(
        cashKickId,
        contractId,
        scheduleId,
        updateScheduleDTO,
        req.user.sub,
        req.user.type,
      );
    });
  });

  describe('getCashKicks', () => {
    it('should call service with correct params when id is provided', async () => {
      const id = 1;
      const req = { user: mockUser };

      await controller.getCashKicks(id, undefined, undefined, req);

      expect(service.getCashKickById).toHaveBeenCalledWith(
        id,
        req.user.sub,
        req.user.type,
      );
    });

    it('should call service with correct params when id is not provided', async () => {
      const page = 1;
      const limit = 10;
      const req = { user: mockUser };

      await controller.getCashKicks(undefined, page, limit, req);

      expect(service.getAllCashKicks).toHaveBeenCalledWith(
        req.user.sub,
        req.user.type,
        page,
        limit,
      );
    });
  });
});
