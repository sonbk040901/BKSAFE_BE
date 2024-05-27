import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  make: string;
  @IsOptional()
  model: string;
  @IsOptional()
  @IsNumber()
  year: number;
  @IsOptional()
  color: string;
  @IsOptional()
  licensePlateNumber: string;
  @IsOptional()
  vin: string;
  @IsOptional()
  transmission: string;
}
