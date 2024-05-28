import { IsBoolean, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActionDriverDto {
  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;
  @ApiProperty({ type: Boolean, default: true })
  @IsBoolean()
  active: boolean;
}
