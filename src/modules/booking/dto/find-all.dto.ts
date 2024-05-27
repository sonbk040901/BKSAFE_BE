import { PagingAndSortDto } from '~dto/paging-and-sort.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '~entities/booking.entity';
import { Transform } from 'class-transformer';

export class FindAllDto extends PagingAndSortDto {
  @IsOptional()
  @IsEnum(BookingStatus, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => v.toUpperCase());
    if (value.match(','))
      return value.split(',').map((v: string) => v.toUpperCase());
    return value.toUpperCase() || undefined;
  })
  status?: BookingStatus | BookingStatus[];
}
