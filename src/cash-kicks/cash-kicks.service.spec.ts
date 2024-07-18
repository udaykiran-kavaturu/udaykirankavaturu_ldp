import { Test, TestingModule } from '@nestjs/testing';
import { CashKicksService } from './cash-kicks.service';

describe('CashKicksService', () => {
  let service: CashKicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashKicksService],
    }).compile();

    service = module.get<CashKicksService>(CashKicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
