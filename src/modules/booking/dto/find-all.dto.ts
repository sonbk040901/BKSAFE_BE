import { PagingAndSortDto } from '~dto/paging-and-sort.dto';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllDto extends PagingAndSortDto {
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  status: string;
}
