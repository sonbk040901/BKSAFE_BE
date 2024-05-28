import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeFindDriverModeDto {
  @ApiProperty({ type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  auto?: boolean;
}
