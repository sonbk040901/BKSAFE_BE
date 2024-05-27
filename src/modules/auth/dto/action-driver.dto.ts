import { IsBoolean, IsPhoneNumber } from 'class-validator';

export class ActionDriverDto {
  @IsPhoneNumber('VN')
  phone: string;
  @IsBoolean()
  active: boolean;
}
