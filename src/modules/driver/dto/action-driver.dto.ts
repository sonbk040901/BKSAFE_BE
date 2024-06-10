import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterStatus } from '~entities/driver.entity';
import { Transform } from 'class-transformer';

export class ActionDriverDto {
  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;
  @IsEnum(RegisterStatus)
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  status: RegisterStatus = RegisterStatus.ACCEPTED;
}
