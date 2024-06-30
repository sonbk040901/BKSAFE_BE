import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindDriversDto {
  @ApiProperty({
    description: 'Address to search drivers',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
  @ApiProperty({
    description: 'Latitude to search drivers',
    example: 10.123456,
  })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  latitude: number;
  @ApiProperty({
    description: 'Longitude to search drivers',
    example: 106.123456,
  })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  longitude: number;
  @ApiProperty({
    description: 'Radius to search drivers',
    example: 10_000,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  radius: number = 5_000;
}
