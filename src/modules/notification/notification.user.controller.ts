import { Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentAcc } from '~/common/decorators/param/current-account.decorator';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { NotificationService } from './notification.service';

@ApiTags('user/notification')
@UserCtrl('notifications')
export class NotificationUserController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getAll(@CurrentAcc('id') userId: number) {
    return await this.notificationService.getAllByUser(userId);
  }
}
