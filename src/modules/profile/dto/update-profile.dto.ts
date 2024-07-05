import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Gender } from '~entities/account.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Gender)
  gender?: Gender;
  @IsOptional()
  @IsUrl()
  avatar?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
}
