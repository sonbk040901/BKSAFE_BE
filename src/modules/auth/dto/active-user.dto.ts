import { IsPhoneNumber, IsString } from 'class-validator';

export class ActiveUserDto {
  @IsPhoneNumber('VN')
  phone: string;
  @IsString()
  activationCode: string;
}
