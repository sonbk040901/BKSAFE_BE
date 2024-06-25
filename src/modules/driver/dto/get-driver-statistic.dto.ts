import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class GetDriverStatisticDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  month: Date;
}
