import { NotificationService } from './notification.service';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user/notification')
@UserCtrl('notifications')
export class NotificationUserController {
  constructor(private readonly notificationService: NotificationService) {}
}
