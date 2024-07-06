import { IsDate, IsOptional, IsString } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';
import { Transform } from 'class-transformer';

export class UpdateDriverProfileDto extends UpdateProfileDto {
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  birthday?: Date;
  @IsString()
  @IsOptional()
  address?: string;
}
