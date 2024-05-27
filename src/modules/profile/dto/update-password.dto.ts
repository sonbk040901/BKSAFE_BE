import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  oldPassword: string;
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minUppercase: 0,
    minSymbols: 0,
  })
  newPassword: string;
}
