import { NotificationService } from './notification.service';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('notifications')
export class NotificationUserController {
  constructor(private readonly notificationService: NotificationService) {}
}
