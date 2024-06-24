import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumberString, IsString, IsUrl } from 'class-validator';

export class CccdDto {
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
  @IsString()
  fullName: string;
  @ApiProperty({
    default: '0123456789',
  })
  @IsNumberString()
  number: string;
  @IsString()
  address: string;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  issueDate: Date;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expireDate: Date;
}
