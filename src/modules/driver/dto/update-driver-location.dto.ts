import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDriverLocationDto {
  @IsOptional()
  @IsString()
  address: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}
