import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LicenseDto } from '@auth/dto/license.dto';

export class RegisterDriverByUserDto {
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
