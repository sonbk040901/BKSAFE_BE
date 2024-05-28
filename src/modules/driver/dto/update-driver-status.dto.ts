import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { DriverStatus } from '~entities/driver.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverStatusDto {
  @ApiProperty({
    enum: DriverStatus,
    default: DriverStatus.BUSY,
    example: 'ACTIVE',
    description: 'Driver status',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(DriverStatus)
  status: DriverStatus;
}
