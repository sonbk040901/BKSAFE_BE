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
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  distance: number;
  @ApiProperty()
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => LocationDto)
  pickup: LocationDto;
  @ApiProperty()
  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  @Type(() => LocationDto)
  dropOff: LocationDto;
  @ApiProperty({ type: [LocationDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsObject({ each: true })
  stops: LocationDto[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
  @ApiProperty({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  notes: number[] = [];
}
