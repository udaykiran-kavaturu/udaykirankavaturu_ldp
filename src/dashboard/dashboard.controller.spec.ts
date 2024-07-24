import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { DashboardController } from './dashboard.controller';
import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
} from '../entities';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: DashboardService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
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

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    it('should call dashboardService.getDashboardMetrics with the correct user ID', async () => {
      const mockRequest = {
        user: { sub: 123 },
      };
      const mockMetrics = {
        term_cap: 12,
        credit_balance: null,
        max_interest_rate: null,
        outstanding_amount: null,
        next_due_date: null,
      };

      jest
        .spyOn(dashboardService, 'getDashboardMetrics')
        .mockResolvedValue(mockMetrics);

      const result = await controller.getDashboardMetrics(mockRequest);

      expect(dashboardService.getDashboardMetrics).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockMetrics);
    });
  });
});
