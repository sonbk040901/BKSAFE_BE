import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RatingDto {
  @IsNumber()
  bookingId: number;
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
  @IsOptional()
  @IsString()
  review: string;
}
