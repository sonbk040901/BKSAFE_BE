import { IsInt, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class PagingAndSortDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  take: number = 10;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  skip: number = 0;
  @IsOptional()
  @Transform(({ value }) => value.toLocaleLowerCase())
  @Matches(/^(asc|desc)$/)
  order: 'asc' | 'desc' = 'asc';
  @IsOptional()
  sort: string = 'id';
}
