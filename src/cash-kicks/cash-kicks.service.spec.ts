import { Test, TestingModule } from '@nestjs/testing';
import { CashKicksService } from './cash-kicks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contract,
  CashKick,
  CashKickContract,
  PaymentSchedule,
  User,
  CashKickContractStatus,
  UserType,
  PaymentScheduleStatus,
} from '../entities';
import { CashKicksController } from './cash-kicks.controller';
import { DataSource } from 'typeorm';
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCashKickDTO } from './dto';

describe('CashKicksService', () => {
  let service: CashKicksService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAndCount: jest.fn(),
    rollbackTransaction: jest.fn(),
    createQueryRunner: jest.fn(),
    queryRunner: {
      manager: {
        findAndCount: jest.fn(),
      },
    },
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(() => ({
        select: jest.fn(() => ({
          getRawOne: jest.fn(() => Promise.resolve({ id: 1 })),
        })),
      })),
    })),
  };

  const cashKickContractsRepositoryMock = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn(() => ({
        where: jest.fn(() => ({
          getOne: jest.fn(() => Promise.resolve({ id: 1 })),
        })),
      })),
    })),
    findOne: jest.fn(),
  };

  const dataSourceMock = {
    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        findAndCount: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const queryRunnerMock = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        findAndCount: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };
    jest
      .spyOn(dataSourceMock, 'createQueryRunner')
      .mockReturnValue(queryRunnerMock);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashKicksController],
      providers: [
        CashKicksService,
        { provide: getRepositoryToken(Contract), useValue: mockRepository },
        { provide: getRepositoryToken(CashKick), useValue: mockRepository },
        {
          provide: getRepositoryToken(CashKickContract),
          useValue: cashKickContractsRepositoryMock,
        },
        {
          provide: getRepositoryToken(PaymentSchedule),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockRepository },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<CashKicksService>(CashKicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCashKick', () => {
    const createCashKickDTO: CreateCashKickDTO = {
      contract_ids: [1, 2],
      name: 'test',
      // Add other required fields
    };
    const currentUserID = 1;

    it('should throw an error if contract ids are invalid', async () => {
      dataSourceMock
        .createQueryRunner()
        .manager.findAndCount.mockResolvedValue([[], 0]);
      await expect(
        service.createCashKick(createCashKickDTO, currentUserID),
      ).rejects.toThrow(new HttpException('Invalid contract id', 400));
    });

    it('should throw an error if user has insufficient credit balance', async () => {
      dataSourceMock
        .createQueryRunner()
        .manager.findAndCount.mockResolvedValue([
          [
            { id: 1, amount: 100 },
            { id: 2, amount: 200 },
          ],
          2,
        ]);
      mockRepository.findOne.mockResolvedValue({ credit_balance: 0 });
      mockRepository.create.mockReturnValue({});
      await expect(
        service.createCashKick(createCashKickDTO, currentUserID),
      ).rejects.toThrow(new HttpException('insufficient credit balance', 400));
    });

    it('should create cash kick and cash kick contracts successfully', async () => {
      dataSourceMock
        .createQueryRunner()
        .manager.findAndCount.mockResolvedValue([
          [
            { id: 1, amount: 100 },
            { id: 2, amount: 200 },
          ],
          2,
        ]);
      mockRepository.findOne.mockResolvedValue({ credit_balance: 1000000 });
      mockRepository.create.mockReturnValue(new CashKick());
      dataSourceMock
        .createQueryRunner()
        .manager.save.mockResolvedValue({ id: 1 });
      cashKickContractsRepositoryMock
        .createQueryBuilder()
        .leftJoinAndSelect()
        .where()
        .getOne.mockResolvedValue({ id: 1 });
      const result = await service.createCashKick(
        createCashKickDTO,
        currentUserID,
      );
      expect(result).toBeDefined();
    });
  });

  describe('updateCashKickContract', () => {
    const cashKickId = 1;
    const contractId = 1;
    const updateCashKickContractDTO = {
      status: CashKickContractStatus.ACTIVE,
    };
    const currentUserID = 1;
    const currentUserType = UserType.ADMIN;

    it('should throw an error if contract not found', async () => {
      cashKickContractsRepositoryMock.findOne.mockResolvedValue(null);
      await expect(
        service.updateCashKickContract(
          cashKickId,
          contractId,
          updateCashKickContractDTO,
          currentUserID,
          currentUserType,
        ),
      ).rejects.toThrow(
        new HttpException('contract not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user has no permission', async () => {
      dataSourceMock.createQueryRunner().manager.findOne.mockResolvedValue({
        contract_id: contractId,
        cash_kick_id: cashKickId,
      });
      mockRepository.findOne.mockResolvedValue({ lender_id: 2 });
      await expect(
        service.updateCashKickContract(
          cashKickId,
          contractId,
          updateCashKickContractDTO,
          currentUserID,
          UserType.SEEKER,
        ),
      ).rejects.toThrow(
        new ForbiddenException('you can only view or update your own contract'),
      );
    });

    it('should throw an error if cash kick contract is already in given status', async () => {
      dataSourceMock.createQueryRunner().manager.findOne.mockResolvedValue({
        contract_id: contractId,
        cash_kick_id: cashKickId,
        status: CashKickContractStatus.ACTIVE,
      });
      mockRepository.findOne.mockResolvedValue({
        status: updateCashKickContractDTO.status,
        lender_id: 1,
      });
      await expect(
        service.updateCashKickContract(
          cashKickId,
          contractId,
          updateCashKickContractDTO,
          currentUserID,
          currentUserType,
        ),
      ).rejects.toThrow(
        new HttpException(
          'cash kick contract is already in given status',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should update cash kick contract and create payment schedule successfully', async () => {
      dataSourceMock.createQueryRunner().manager.findOne.mockResolvedValue({
        contract_id: contractId,
        cash_kick_id: cashKickId,
        status: CashKickContractStatus.PENDING,
      });
      mockRepository.findOne.mockResolvedValue({ lender_id: currentUserID });
      dataSourceMock
        .createQueryRunner()
        .manager.update.mockResolvedValue({ affected: 1 });
      mockRepository.save.mockResolvedValue({ id: 1 });
      dataSourceMock
        .createQueryRunner()
        .manager.update.mockResolvedValue({ affected: 1 });
      cashKickContractsRepositoryMock.findOne.mockResolvedValue({ id: 1 });
      const result = await service.updateCashKickContract(
        cashKickId,
        contractId,
        updateCashKickContractDTO,
        currentUserID,
        currentUserType,
      );
      expect(result).toBeDefined();
    });
  });

  describe('updateSchedule', () => {
    const cashKickId = 1;
    const contractId = 1;
    const scheduleId = 1;
    const updateScheduleDTO = {
      status: PaymentScheduleStatus.PENDING,
    };
    const currentUserID = 1;
    const currentUserType = UserType.ADMIN;

    it('should throw an error if schedule entry not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateSchedule(
          cashKickId,
          contractId,
          scheduleId,
          updateScheduleDTO,
          currentUserID,
          currentUserType,
        ),
      ).rejects.toThrow(
        new HttpException('schedule entry not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user has no permission', async () => {
      mockRepository.findOne.mockResolvedValue({ seeker_id: 2 });
      await expect(
        service.updateSchedule(
          cashKickId,
          contractId,
          scheduleId,
          updateScheduleDTO,
          currentUserID,
          UserType.SEEKER,
        ),
      ).rejects.toThrow(
        new ForbiddenException(
          'you can only view or update your own schedule entries',
        ),
      );
    });

    it('should throw an error if schedule entry is already in given status', async () => {
      mockRepository.findOne.mockResolvedValue({
        status: updateScheduleDTO.status,
      });
      await expect(
        service.updateSchedule(
          cashKickId,
          contractId,
          scheduleId,
          updateScheduleDTO,
          currentUserID,
          currentUserType,
        ),
      ).rejects.toThrow(
        new HttpException(
          'schedule entry is already in given status',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should update schedule entry successfully', async () => {
      mockRepository.findOne.mockResolvedValue({ seeker_id: currentUserID });
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue({ id: scheduleId });
      const result = await service.updateSchedule(
        cashKickId,
        contractId,
        scheduleId,
        updateScheduleDTO,
        currentUserID,
        currentUserType,
      );
      expect(result).toBeDefined();
    });
  });

  describe('getCashKickById', () => {
    const id = 1;
    const currentUserID = 1;
    const currentUserType = UserType.ADMIN;

    it('should throw an error if cash kick not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.getCashKickById(id, currentUserID, currentUserType),
      ).rejects.toThrow(
        new HttpException('cash kick not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if user has no permission', async () => {
      mockRepository.findOne.mockResolvedValue({ seeker_id: 2 });
      await expect(
        service.getCashKickById(id, currentUserID, UserType.SEEKER),
      ).rejects.toThrow(
        new ForbiddenException(
          'you can only view or update your own cash kick',
        ),
      );
    });

    it('should return cash kick successfully', async () => {
      mockRepository.findOne.mockResolvedValue({ seeker_id: currentUserID });
      const result = await service.getCashKickById(
        id,
        currentUserID,
        currentUserType,
      );
      expect(result).toBeDefined();
    });
  });

  describe('getAllCashKicks', () => {
    const page = 1;
    const limit = 10;
    const currentUserID = 1;
    const currentUserType = UserType.SEEKER;

    it('should throw an error if no cash kicks found', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      await expect(
        service.getAllCashKicks(page, limit, currentUserID, currentUserType),
      ).rejects.toThrow(
        new HttpException('no cash kicks found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return cash kicks successfully for seeker', async () => {
      mockRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.getAllCashKicks(
        page,
        limit,
        currentUserID,
        currentUserType,
      );
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
    });

    it('should return cash kicks successfully for admin', async () => {
      mockRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.getAllCashKicks(
        page,
        limit,
        currentUserID,
        UserType.ADMIN,
      );
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
    });

    it('should return correct pagination meta', async () => {
      mockRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 20]);
      const result = await service.getAllCashKicks(
        page,
        limit,
        currentUserID,
        currentUserType,
      );
      expect(result.meta.total).toBe(20);
      expect(result.meta.page).toBe(page);
      expect(result.meta.limit).toBe(limit);
      expect(result.meta.totalPages).toBe(2);
    });
  });
});
