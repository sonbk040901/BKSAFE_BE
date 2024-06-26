import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ActivateStatus } from '~entities/account.entity';

export class ActionDriverDto {
  @IsEnum(ActivateStatus)
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  status: ActivateStatus = ActivateStatus.ACTIVATED;
}
