import { LicenseDto } from '@auth/dto/license.dto';
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

export class RegisterDriverByUserDto {
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
  @IsObject()
  license: LicenseDto;
  @Type(() => CccdDto)
  @ValidateNested()
  @IsObject()
  cccd: CccdDto;
}
