import { NotificationService } from './notification.service';
import { AdminCtrl } from '~decors/controller/controller.decorator';

@AdminCtrl('notifications')
export class NotificationAdminController {
  constructor(private readonly notificationService: NotificationService) {}
}
