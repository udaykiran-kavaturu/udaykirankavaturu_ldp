import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentScheduleStatus } from '../../entities';

export class UpdateScheduleDTO {
  @ApiProperty()
  @IsEnum(PaymentScheduleStatus)
  @IsNotEmpty()
  status: PaymentScheduleStatus;
}
