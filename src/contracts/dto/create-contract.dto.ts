import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, Max, Min } from 'class-validator';
import { ContractType } from 'src/entities';

export class CreateContractDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z\s]*$/, {
        message: 'Name must contain only letters and spaces',
    })
    name: string

    @ApiProperty()
    @IsEnum(ContractType)
    @IsNotEmpty()
    type: ContractType;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Max(100)
    @Min(0)
    fee: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(28)
    scheduled_due_date: number;
}
