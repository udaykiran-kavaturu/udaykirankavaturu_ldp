import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Matches,
} from 'class-validator';

import { UserType } from '../../entities';

export class UpdateUserDTO {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;
}
