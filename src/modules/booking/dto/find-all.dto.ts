import { PagingAndSortDto } from '~dto/paging-and-sort.dto';
import { IsOptional, Matches } from 'class-validator';
import { BookingStatus } from '~entities/booking.entity';
import { Transform } from 'class-transformer';

export class FindAllDto extends PagingAndSortDto {
  @IsOptional()
  @Matches(/^(PENDING|ACCEPTED|REJECTED|CANCELLED|COMPLETED)$/, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => v.toUpperCase());
    return value.toUpperCase();
  })
  status?: BookingStatus | BookingStatus[];
}
