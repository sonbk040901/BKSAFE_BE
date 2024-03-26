import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { Gender } from '~entities/account.entity';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  fullName: string;
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
  @IsOptional()
  @Matches(/(MALE|FEMALE|OTHER)/)
  @Transform(({ value }) => value.toUpperCase())
  gender: Gender;
}
