import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDriverController } from './notification.driver.controller';
import { NotificationUserController } from './notification.user.controller';
import { NotificationAdminController } from './notification.admin.controller';

@Module({
  controllers: [
    NotificationDriverController,
    NotificationUserController,
    NotificationAdminController,
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
