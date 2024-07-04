import { Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentAcc } from '~/common/decorators/param/current-account.decorator';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { NotificationService } from './notification.service';

@ApiTags('driver/notification')
@DriverCtrl('notifications')
export class NotificationDriverController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(@CurrentAcc('id') driverId: number) {
    return await this.notificationService.getAllByDriver(driverId);
  }
}
