import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserType } from '../entities';
import { UsersService } from './users.service';
import { DataSource, Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';

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

  it("should throw ForbiddenException when non-admin user tries to update another user's profile", async () => {
    const id = 2;
    const updateUserDTO = {
      name: 'New Name',
      password: 'someNewPassword',
      type: UserType.LENDER,
    };
    const currentUser = { sub: 1, type: UserType.LENDER };
    const mockRequest = { someRequestData: 'data' };

    await expect(
      controller.updateUser(id, updateUserDTO, currentUser, mockRequest),
    ).rejects.toThrow(ForbiddenException);

    expect(mockUserService.update).not.toHaveBeenCalled();
  });

  it('should call usersService.update with correct parameters when admin updates any profile', async () => {
    const id = 2;
    const updateUserDTO = {
      name: 'New Name',
      password: 'someNewPassword',
      type: UserType.LENDER,
    };
    const currentUser = { sub: 1, type: UserType.ADMIN };
    const mockRequest = { someRequestData: 'data' };

    mockUserService.update.mockResolvedValue({ id: 2, name: 'New Name' });

    await controller.updateUser(id, updateUserDTO, currentUser, mockRequest);

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
    const currentUser = { sub: 1, type: UserType.LENDER };
    const mockRequest = { someRequestData: 'data' };

    mockUserService.update.mockResolvedValue({ id: 1, name: 'New Name' });

    await controller.updateUser(id, updateUserDTO, currentUser, mockRequest);

    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updateUserDTO,
      mockRequest,
    );
  });

  it('should call usersService.findOneByID with correct parameter when user views own profile', async () => {
    const id = 1;
    const currentUser = { sub: 1, type: UserType.LENDER };
    const mockUser = { id: 1, name: 'Test User' };

    mockUserService.findOneByID = jest.fn().mockResolvedValue(mockUser);

    const result = await controller.getUser(id, currentUser);

    expect(mockUserService.findOneByID).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockUser);
  });

  it('should call usersService.findOneByID with correct parameter when admin views any profile', async () => {
    const id = 2;
    const currentUser = { sub: 1, type: UserType.ADMIN };
    const mockUser = { id: 2, name: 'Another User' };

    mockUserService.findOneByID = jest.fn().mockResolvedValue(mockUser);

    const result = await controller.getUser(id, currentUser);

    expect(mockUserService.findOneByID).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockUser);
  });

  it("should throw ForbiddenException when non-admin user tries to view another user's profile", async () => {
    const id = 2;
    const currentUser = { sub: 1, type: UserType.LENDER };

    await expect(controller.getUser(id, currentUser)).rejects.toThrow(
      ForbiddenException,
    );

    await expect(mockUserService.findOneByID).not.toHaveBeenCalled();
  });
});
