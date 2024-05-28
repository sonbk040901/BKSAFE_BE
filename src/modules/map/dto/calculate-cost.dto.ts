import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateCostDto {
  @ApiProperty({
    description: 'Distance between two points',
    example: 10000,
  })
  @IsNumber()
  distance: number;
  @ApiProperty({
    description: 'Number of waypoints',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberOfWaypoints?: number;
  @ApiProperty({
    description: 'Positions',
    example: [
      {
        lat: 10.123456,
        lng: 106.123456,
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  positions?: unknown[];
}
