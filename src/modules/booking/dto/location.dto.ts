import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  address: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}
