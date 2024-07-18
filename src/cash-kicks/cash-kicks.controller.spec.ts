import { Test, TestingModule } from '@nestjs/testing';
import { CashKicksController } from './cash-kicks.controller';

describe('CashKicksController', () => {
  let controller: CashKicksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashKicksController],
    }).compile();

    controller = module.get<CashKicksController>(CashKicksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
