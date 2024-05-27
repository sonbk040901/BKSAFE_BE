import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { DriverStatus } from '~entities/driver.entity';

export class UpdateDriverStatusDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(DriverStatus)
  status: DriverStatus;
}
