import { PagingAndSortDto } from '~dto/paging-and-sort.dto';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '~entities/booking.entity';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllDto extends PagingAndSortDto {
  @ApiProperty({
    required: false,
    enum: BookingStatus,
    example: 'PENDING',
    description: 'Filter by status',
    isArray: true,
  })
  @IsOptional()
  @IsEnum(BookingStatus, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => v.toUpperCase());
    if (value.match(','))
      return value.split(',').map((v: string) => v.toUpperCase());
    return value.toUpperCase() || undefined;
  })
  status?: BookingStatus | BookingStatus[];

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  time: Date = new Date();
}
