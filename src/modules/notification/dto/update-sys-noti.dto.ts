import { CreateSysNotificationDto } from '~/modules/notification/dto/create-sys-noti.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSysNotificationDto extends PartialType(
  CreateSysNotificationDto,
) {}
