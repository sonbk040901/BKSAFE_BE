import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDriverLocationDto {
  @IsNotEmpty()
  address: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}
