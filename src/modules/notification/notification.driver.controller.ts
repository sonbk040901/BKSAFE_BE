import { NotificationService } from './notification.service';
import { DriverCtrl } from '~decors/controller/controller.decorator';

@DriverCtrl('notifications')
export class NotificationDriverController {
  constructor(private readonly notificationService: NotificationService) {}
}
