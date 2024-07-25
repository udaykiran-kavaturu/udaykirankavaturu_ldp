import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { UsersController } from './users.controller';
import { User, UserType } from '../entities';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockRepository: Partial<Repository<User>> = {
    find: jest.fn(),
    save: jest.fn(),
  };
  const mockUserService = {
    update: jest.fn(),
    findOneByID: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
      exports: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call usersService.update with correct parameters when admin updates any profile', async () => {
    const id = 2;
    const updateUserDTO = {
      name: 'New Name',
      password: 'someNewPassword',
      type: UserType.LENDER,
    };
    const mockRequest = { user: { sub: 1, type: UserType.ADMIN } };

    mockUserService.update.mockResolvedValue({ id: 2, name: 'New Name' });

    await controller.updateUser(id, updateUserDTO, mockRequest);

    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updateUserDTO,
      mockRequest,
    );
  });

  it('should call usersService.update with correct parameters when user updates own profile', async () => {
    const id = 1;
    const updateUserDTO = {
      name: 'New Name',
      password: 'someNewPassword',
      type: UserType.LENDER,
    };
    const mockRequest = { user: { sub: 1, type: UserType.LENDER } };

    mockUserService.update.mockResolvedValue({ id: 1, name: 'New Name' });

    await controller.updateUser(id, updateUserDTO, mockRequest);

    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updateUserDTO,
      mockRequest,
    );
  });

  it('should call usersService.findOneByID with correct parameter when user views own profile', async () => {
    const id = 1;
    const mockUser = { id: 1, name: 'Test User' };

    mockUserService.findOneByID = jest.fn().mockResolvedValue(mockUser);

    const result = await controller.getUser(id);

    expect(mockUserService.findOneByID).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockUser);
  });

  it('should call usersService.findOneByID with correct parameter when admin views any profile', async () => {
    const id = 2;
    const mockUser = { id: 2, name: 'Another User' };

    mockUserService.findOneByID = jest.fn().mockResolvedValue(mockUser);

    const result = await controller.getUser(id);

    expect(mockUserService.findOneByID).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockUser);
  });
});
