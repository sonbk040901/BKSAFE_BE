import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { RoleName } from '~/common/enums/role-name.enum';

export class LoginDto {
  @IsPhoneNumber('VN')
  phone: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsEnum(RoleName)
  @Transform(({ value }) => value.toUpperCase())
  role: RoleName = RoleName.USER;
}
