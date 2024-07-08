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
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName: string;
  @ApiProperty({
    default: '0353763099',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone: string;
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minUppercase: 0,
      minSymbols: 0,
    },
    { message: 'Mật khẩu phải dài trên 6 ký tự' },
  )
  password: string;
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender: Gender;
}
