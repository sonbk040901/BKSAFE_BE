import {
  IsDate,
  IsNumberString,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LicenseDto {
  @IsUrl()
  frontImage: string;
  @IsUrl()
  backImage: string;
  @IsNumberString()
  number: string;
  @IsString()
  fullName: string;
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
  @Matches(/^[A-F]$/, { message: 'Class type must be A, B, C, D, E, F' })
  classType: string; //B1, B2, C, D, E, F
}
