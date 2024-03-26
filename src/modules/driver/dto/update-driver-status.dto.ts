import { Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDriverStatusDto {
  @Transform(({ value }) => value.toUpperCase())
  @Matches(/(AVAILABLE|BUSY|OFFLINE)/)
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
}
