import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LicenseDto {
  @ApiProperty({
    default: 'https://i.imgur.com/9U7dX8w.png',
  })
  @IsUrl()
  frontImage: string;
  @ApiProperty({
    default: 'https://i.imgur.com/9U7dX8w.png',
  })
  @IsUrl()
  backImage: string;
  @ApiProperty({
    default: '0123456789',
  })
  @IsNumberString()
  number: string;
  @ApiProperty()
  @IsString()
  fullName: string;
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  issueDate: Date;
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expireDate: Date;
  @ApiProperty({
    default: 'C',
  })
  @IsEnum(['A', 'B', 'C', 'D', 'E', 'F'], {
    message: 'Class type must be A, B, C, D, E, F',
  })
  classType: string; //B1, B2, C, D, E, F
}
