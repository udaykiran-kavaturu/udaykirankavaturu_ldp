import { Test, TestingModule } from '@nestjs/testing';
import { CashKicksController } from './cash-kicks.controller';
import { CashKicksService } from './cash-kicks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
} from '../entities';
import { DataSource } from 'typeorm';

describe('CashKicksController', () => {
  let controller: CashKicksController;
  // let service: CashKicksService;

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
    // service = module.get<CashKicksService>(CashKicksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
