import { RegisterDto } from '@auth/dto/register.dto';
import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { LicenseDto } from '@auth/dto/license.dto';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDriverDto extends RegisterDto {
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @Type(() => LicenseDto)
  @ValidateNested()
  @IsObject()
  license: LicenseDto;
}
