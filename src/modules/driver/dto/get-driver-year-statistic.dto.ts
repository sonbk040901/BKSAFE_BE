import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetDriverYearStatisticDto {
  @IsNumber({})
  @Min(2000)
  @Max(new Date().getFullYear())
  @Transform(({ value }) => parseInt(value))
  year: number;
}
