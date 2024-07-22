import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../entities';
import { ContractsService } from './contracts.service';

describe('ContractsController', () => {
  let controller: ContractsController;
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
      providers: [
        ContractsService,
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

    controller = module.get<ContractsController>(ContractsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
