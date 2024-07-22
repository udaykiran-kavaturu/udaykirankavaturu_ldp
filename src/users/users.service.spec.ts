import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { UsersController } from './users.controller';
import { DataSource, Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Partial<Repository<User>>;

  mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {}
        }
      ],
      exports: [UsersService],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
