import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CalculateCostDto {
  @IsNumber()
  distance: number;
  @IsOptional()
  @IsNumber()
  numberOfWaypoints?: number;
  @IsOptional()
  @IsArray()
  positions?: unknown[];
}
