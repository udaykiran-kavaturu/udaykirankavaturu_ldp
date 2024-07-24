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
import { User, UserType } from '../entities';
import { DataSource, Repository } from 'typeorm';
import { blacklistedTokens } from '../utils/blacklisted-tokens';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

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
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const registerDTO = {
      name: 'newuser',
      password: 'password123',
      email: 'newuser@example.com',
      type: UserType.LENDER,
    };

    const expectedResult = {
      id: 1,
      name: 'newuser',
      email: 'newuser@example.com',
      type: UserType.LENDER,
      credit_limit: 0,
      credit_balance: 0,
      status: 1,
      password: 'password123',
      created_by: 1,
      updated_by: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

    const result = await controller.register(registerDTO);

    expect(result).toEqual(expectedResult);
    expect(authService.register).toHaveBeenCalledWith(registerDTO);
  });

  it('should call authService.logIn with correct parameters', async () => {
    const loginDTO = {
      email: 'user@example.com',
      password: 'password123',
    };

    const mockResult = { access_token: 'mocked.jwt.token' };
    jest.spyOn(authService, 'logIn').mockResolvedValue(mockResult);

    const result = await controller.logIn(loginDTO);

    expect(authService.logIn).toHaveBeenCalledWith(
      loginDTO.email,
      loginDTO.password,
    );
    expect(result).toEqual(mockResult);
  });

  it('should add token to blacklist and return success message', () => {
    const mockRequest = {
      token: 'sample.jwt.token',
    };

    const result = controller.logOut(mockRequest);

    expect(blacklistedTokens).toContain('sample.jwt.token');
    expect(result).toEqual({ message: 'logged out' });
  });
});
