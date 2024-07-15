import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword, Matches } from 'class-validator';
import { UserType } from 'src/users/user.entity';

export class RegisterDTO {

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z\s]*$/, {
        message: 'Name must contain only letters and spaces'
    })
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @IsEnum(UserType)
    @IsNotEmpty()
    type: UserType;
}