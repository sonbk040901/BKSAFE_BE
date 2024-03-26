import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from './location.dto';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  distance: number;
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => LocationDto)
  pickup: LocationDto;
  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  @Type(() => LocationDto)
  dropOff: LocationDto;
  @IsArray()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject({ each: true })
  stops: LocationDto[];
  @IsOptional()
  @IsString()
  note: string;
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  notes: number[];
}
