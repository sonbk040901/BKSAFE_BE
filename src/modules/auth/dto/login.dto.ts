import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: '0353763088' })
  @IsPhoneNumber('VN')
  phone: string;
  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  password: string;
}
