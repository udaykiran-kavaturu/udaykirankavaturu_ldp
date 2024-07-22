import { Test, TestingModule } from '@nestjs/testing';
import { CashKicksService } from './cash-kicks.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Contract, CashKick, CashKickContract, PaymentSchedule, User } from '../entities';
import { CashKicksController } from './cash-kicks.controller';
import { DataSource } from 'typeorm';

describe('CashKicksService', () => {
  let service: CashKicksService;

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
        { provide: getRepositoryToken(CashKickContract), useValue: mockRepository },
        { provide: getRepositoryToken(PaymentSchedule), useValue: mockRepository },
        { provide: getRepositoryToken(User), useValue: mockRepository },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CashKicksService>(CashKicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
