import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarDto {
  @ApiProperty({
    description: 'Make of car',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  make: string;
  @ApiProperty({
    description: 'Model of car',
    example: 'Camry',
    required: false,
  })
  @IsOptional()
  model: string;
  @ApiProperty({
    description: 'Year of car',
    example: 2021,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  year: number;
  @ApiProperty({
    description: 'Color of car',
    example: 'Red',
    required: false,
  })
  @IsOptional()
  color: string;
  @ApiProperty({
    description: 'License plate number of car',
    example: '29A-12345',
    required: false,
  })
  @IsOptional()
  licensePlateNumber: string;
  @ApiProperty({
    description: 'VIN of car',
    example: '1HGCM82633A123456',
    required: false,
  })
  @IsOptional()
  vin: string;
  @ApiProperty({
    description: 'Transmission of car',
    example: 'Automatic',
    required: false,
  })
  @IsOptional()
  transmission: string;
}
