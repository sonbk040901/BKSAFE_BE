import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PagingAndSortDto {
  @ApiProperty({
    default: 10,
    description: 'The number of items in a page',
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  take: number = 10;
  @ApiProperty({
    default: 0,
    description:
      'The number of items to skip before starting to collect the result set',
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  skip: number = 0;
  @ApiProperty({
    default: 'asc',
    description: 'The order of the items',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toLocaleLowerCase())
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';
  @ApiProperty({
    default: 'id',
    description: 'The field to sort by',
    required: false,
  })
  @IsOptional()
  sort: string = 'id';
}
