import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverLocationDto {
  @ApiProperty({
    description: 'Driver address',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @IsString()
  address: string;
  @ApiProperty({
    description: 'Driver latitude',
    example: 10.123456,
  })
  @IsNumber()
  latitude: number;
  @ApiProperty({
    description: 'Driver longitude',
    example: 106.123456,
  })
  @IsNumber()
  longitude: number;
}
