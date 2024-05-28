import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { RoleName } from '~/common/enums/role-name.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: '0353763088' })
  @IsPhoneNumber('VN')
  phone: string;
  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsEnum(RoleName)
  @Transform(({ value }) => value.toUpperCase())
  role: RoleName = RoleName.USER;
}
