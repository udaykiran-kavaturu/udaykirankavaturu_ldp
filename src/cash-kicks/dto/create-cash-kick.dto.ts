import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, ValidateNested } from 'class-validator';

export class CreateCashKickDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z\s]*$/, {
        message: 'Name must contain only letters and spaces',
    })
    name: string;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty({ message: 'contract_ids array must not be empty' })
    @Type(() => Number)
    @IsNumber({}, { each: true, message: 'Each element in contract_ids must be a number' })
    contract_ids: number[]
}
