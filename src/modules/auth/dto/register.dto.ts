import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Gender } from '~entities/account.entity';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    default: 'driver@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({
    default: '0353763099',
  })
  @IsPhoneNumber('VN')
  phone: string;
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minUppercase: 0,
    minSymbols: 0,
  })
  password: string;
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Gender)
  gender: Gender;
}
