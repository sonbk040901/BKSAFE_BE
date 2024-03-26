import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindDriversDto {
  @IsString()
  address: string;
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  latitude: number;
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  longitude: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  radius: number = 10_000;
}
