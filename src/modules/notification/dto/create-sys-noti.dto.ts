import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { SystemNotificationTarget } from '~entities/system-noti.entity';

export class CreateSysNotificationDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsUrl()
  image: string;
  @IsEnum(SystemNotificationTarget)
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  target: SystemNotificationTarget = SystemNotificationTarget.ALL;
}
