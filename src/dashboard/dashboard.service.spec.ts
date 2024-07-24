import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
} from '../entities';
import { DashboardController } from './dashboard.controller';
import { DataSource } from 'typeorm';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockContractRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    }),
  };

  const mockCashKickRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockCashKickContractRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockPaymentScheduleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    }),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
        {
          provide: getRepositoryToken(CashKick),
          useValue: mockCashKickRepository,
        },
        {
          provide: getRepositoryToken(CashKickContract),
          useValue: mockCashKickContractRepository,
        },
        {
          provide: getRepositoryToken(PaymentSchedule),
          useValue: mockPaymentScheduleRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard metrics', async () => {
    const response = {
      term_cap: 12,
      credit_balance: 100,
      max_interest_rate: 10,
      outstanding_amount: 500,
      next_due_date: '2024-07-25',
    };

    mockUserRepository.findOne.mockReturnValue({ credit_balance: 100 });
    mockCashKickContractRepository.find.mockReturnValue([
      { contract_id: 1, status: 'ACTIVE' },
    ]);
    mockContractRepository.createQueryBuilder.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockReturnValue({
        maxFee: 10,
      }),
    });
    mockPaymentScheduleRepository.createQueryBuilder.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockReturnValue({
        totalOutstandingAmount: 500,
        nextDueDate: '2024-07-25',
      }),
    });

    expect(await service.getDashboardMetrics(1)).toEqual(response);
  });

  it('should return dashboard metrics with no active contracts', async () => {
    const response = {
      term_cap: 12,
      credit_balance: 100,
      max_interest_rate: null,
      outstanding_amount: null,
      next_due_date: null,
    };

    mockUserRepository.findOne.mockReturnValue({ credit_balance: 100 });
    mockCashKickContractRepository.find.mockReturnValue([]);

    expect(await service.getDashboardMetrics(1)).toEqual(response);
  });
});
