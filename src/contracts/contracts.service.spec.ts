import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../entities';
import { ContractsController } from './contracts.controller';

describe('ContractsService', () => {
  let service: ContractsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockRepository
        },
        {
          provide: 'DataSource',
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
