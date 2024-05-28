import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old password',
    example: 'oldPassword',
  })
  @IsNotEmpty()
  oldPassword: string;
  @ApiProperty({
    description: 'New password',
    example: 'newPassword',
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minUppercase: 0,
    minSymbols: 0,
  })
  newPassword: string;
}
