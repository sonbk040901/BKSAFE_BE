import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RatingDto {
  @ApiProperty({
    description: 'Booking id',
    example: 1,
  })
  @IsNumber()
  bookingId: number;
  @ApiProperty({
    description: 'Rating',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
  @ApiProperty({
    description: 'Review',
    example: 'Great service!',
    required: false,
  })
  @IsOptional()
  @IsString()
  review: string;
}
