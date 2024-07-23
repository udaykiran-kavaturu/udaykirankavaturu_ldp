import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JWTConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { User, UserType } from '../entities';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let service: AuthService;
  const mockRepository: Partial<Repository<User>> = {
    find: jest.fn(),
    save: jest.fn(),
  };
  const mockUsersService: any = {
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    mockUsersService.findOne.mockResolvedValue(null);

    await expect(service.logIn('fake@email.com', 'password')).rejects.toThrow(UnauthorizedException);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('fake@email.com');
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    const mockUser = { email: 'test@user.com', password: 'hashedPassword' };
    mockUsersService.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

    await expect(service.logIn('test@user.com', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('test@user.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });

  it('should return an access token for valid credentials', async () => {
    const mockUser = { id: 1, name: 'testUser', type: 'user', password: 'hashedPassword' };
    mockUsersService.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    };
    (service as any).jwtService = mockJwtService;

    const result = await service.logIn('test@user.com', 'correctPassword');

    expect(result).toEqual({ access_token: 'mocked.jwt.token' });
    expect(mockUsersService.findOne).toHaveBeenCalledWith('test@user.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: 'testUser',
      type: 'user',
    });
  });

  it('should create a new user and return the result', async () => {
    const registerDTO = {
      name: 'new user',
      password: 'password123',
      email: 'newuser@example.com',
      type: UserType.LENDER
    };

    const createdUser = {
      id: 1,
      name: 'new user',
      password: 'password123',
      email: 'newuser@example.com',
      type: 'lender'
    };

    mockUsersService.create.mockResolvedValue(createdUser);

    const result = await service.register(registerDTO);

    expect(result).toEqual(createdUser);
    expect(mockUsersService.create).toHaveBeenCalledWith(registerDTO);
  });


});
