import { IsEnum, IsOptional } from 'class-validator';
import { RegisterStatus } from '~entities/driver.entity';
import { Transform } from 'class-transformer';

export class ActionRegisterDriverDto {
  @IsEnum(RegisterStatus)
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  status: RegisterStatus = RegisterStatus.ACCEPTED;
}
