import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActiveUserDto {
  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;
  @ApiProperty()
  @IsString({ message: 'Mã kích hoạt không hợp lệ' })
  activationCode: string;
}
