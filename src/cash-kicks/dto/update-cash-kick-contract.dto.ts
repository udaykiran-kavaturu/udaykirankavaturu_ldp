import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CashKickContractStatus } from 'src/entities';

export class UpdateCashKickContractDTO {
  @ApiProperty()
  @IsEnum(CashKickContractStatus)
  @IsNotEmpty()
  status: CashKickContractStatus;
}