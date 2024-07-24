import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities';
import { UsersController } from './users.controller';
import { DataSource } from 'typeorm';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository: any = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user when a valid email is provided', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    mockRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findOne('test@example.com');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should return undefined when no user is found', async () => {
    mockRepository.findOne.mockResolvedValue(undefined);

    const result = await service.findOne('nonexistent@example.com');

    expect(result).toBeUndefined();
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
    });
  });

  it('should throw an error if the repository throws an error', async () => {
    mockRepository.findOne.mockRejectedValue(new Error('Database error'));

    await expect(service.findOne('test@example.com')).rejects.toThrow(
      'Database error',
    );
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should return a user when a valid id is provided', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    mockRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findOneByID(1);

    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw HttpException when no user is found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOneByID(999)).rejects.toThrow(HttpException);
    await expect(service.findOneByID(999)).rejects.toThrow('user not found');

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it('should throw the original error if the repository throws an error', async () => {
    const dbError = new Error('Database error');
    mockRepository.findOne.mockRejectedValue(dbError);

    await expect(service.findOneByID(1)).rejects.toThrow('Database error');
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should create a new user with hashed password', async () => {
    const mockUser: Partial<User> = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'password123',
    };

    const mockHashedPassword = 'hashedPassword123';
    const mockUpdatedUser = { ...mockUser, password: mockHashedPassword };
    const mockCreatedUser = { ...mockUpdatedUser, id: 1 };

    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementation(() => Promise.resolve('mockedSalt'));
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve(mockHashedPassword));
    mockRepository.create.mockReturnValue(mockUpdatedUser);
    mockRepository.save.mockResolvedValue(mockCreatedUser);

    const result = await service.create(mockUser);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(SALT_ROUNDS);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
    expect(mockRepository.create).toHaveBeenCalledWith(mockUpdatedUser);
    expect(mockRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
    expect(result).toEqual(mockCreatedUser);
  });

  it('should throw an error if user creation fails', async () => {
    const mockUser: Partial<User> = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'password123',
    };

    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementation(() => Promise.resolve('mockedSalt'));
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('mockHashedPassword'));
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(service.create(mockUser)).rejects.toThrow('Database error');
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'oldpassword',
      };
      const updateData = {
        name: 'Updated Name',
        password: 'newpassword',
      };
      const mockRequest = {
        user: { sub: 2 },
      };

      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt' as never);
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashedNewPassword' as never);
      mockRepository.update = jest.fn().mockResolvedValue({});
      mockRepository.findOne.mockResolvedValueOnce({
        ...mockUser,
        ...updateData,
        password: 'hashedNewPassword',
        updated_by: 2,
      });

      const result = await service.update(1, updateData, mockRequest);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(SALT_ROUNDS);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'mockedSalt');
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        ...updateData,
        password: 'hashedNewPassword',
        updated_by: 2,
      });
      expect(result).toEqual({
        ...mockUser,
        ...updateData,
        password: 'hashedNewPassword',
        updated_by: 2,
      });
    });

    it('should throw HttpException if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, {}, { user: { sub: 1 } }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no users are found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
