import { IsDate, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetDriverStatisticDto {
  @ApiProperty({ enum: ['month', 'year'] })
  @IsEnum(['month', 'year'])
  type: 'month' | 'year';
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
