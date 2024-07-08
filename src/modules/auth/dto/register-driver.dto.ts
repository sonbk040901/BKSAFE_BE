import { LicenseDto } from '@auth/dto/license.dto';
import { RegisterDto } from '@auth/dto/register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CccdDto } from './cccd.dto';

export class RegisterDriverDto extends RegisterDto {
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  birthday: Date;
  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;
  @ApiProperty()
  @Type(() => LicenseDto)
  @ValidateNested()
  @IsObject({ message: 'Bằng lái xe không được để trống' })
  license: LicenseDto;
  @Type(() => CccdDto)
  @ValidateNested()
  @IsObject({ message: 'CCCD không được để trống' })
  cccd: CccdDto;
}
