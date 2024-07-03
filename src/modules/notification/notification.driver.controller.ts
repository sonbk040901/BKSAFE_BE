import { NotificationService } from './notification.service';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('driver/notification')
@DriverCtrl('notifications')
export class NotificationDriverController {
  constructor(private readonly notificationService: NotificationService) {}
}
