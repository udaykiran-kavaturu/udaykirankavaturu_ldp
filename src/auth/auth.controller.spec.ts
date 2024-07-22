import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JWTConstants } from './auth.constants';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities';
import { DataSource, Repository } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  const mockRepository: Partial<Repository<User>> = {
    find: jest.fn(),
    save: jest.fn(),
  };
  const mockUsersService: Partial<UsersService> = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: JWTConstants.secret,
          signOptions: { expiresIn: '10m' },
        }),
        ThrottlerModule.forRoot([
          {
            ttl: 60000,
            limit: 10,
          },
        ]),
      ],
      providers: [
        AuthService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
