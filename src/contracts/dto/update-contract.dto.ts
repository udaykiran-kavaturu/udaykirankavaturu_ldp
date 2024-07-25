import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { ContractType } from '../../entities';

export class UpdateContractDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ContractType)
  @IsNotEmpty()
  type: ContractType;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000000)
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(100)
  @Min(0)
  fee: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(28)
  scheduled_due_date: number;
}
