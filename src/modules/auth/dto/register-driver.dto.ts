import { RegisterDto } from '@auth/dto/register.dto';
import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { LicenseDto } from '@auth/dto/license.dto';
import { Transform, Type } from 'class-transformer';

export class RegisterDriverDto extends RegisterDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;
  @IsString()
  address: string;
  @Type(() => LicenseDto)
  @ValidateNested()
  @IsObject()
  license: LicenseDto;
}
