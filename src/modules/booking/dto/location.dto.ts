import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'Address of location',
  })
  @IsNotEmpty()
  address: string;
  @ApiProperty({
    description: 'Latitude of location',
    example: 10.123456,
  })
  @IsNumber()
  latitude: number;
  @ApiProperty({
    description: 'Longitude of location',
    example: 106.123456,
  })
  @IsNumber()
  longitude: number;
}
