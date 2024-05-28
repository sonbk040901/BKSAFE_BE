import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LicenseDto } from '@auth/dto/license.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDriverByUserDto {
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
