import { IsBoolean, IsOptional } from 'class-validator';

export class ChangeFindDriverModeDto {
  @IsOptional()
  @IsBoolean()
  auto?: boolean;
}
