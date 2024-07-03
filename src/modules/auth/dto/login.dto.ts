import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: '0353763088' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone: string;
  @ApiProperty({ default: '123456' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
