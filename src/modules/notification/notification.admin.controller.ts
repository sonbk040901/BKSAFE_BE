import { NotificationService } from './notification.service';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateSysNotificationDto } from './dto/update-sys-noti.dto';
import { CreateSysNotificationDto } from './dto/create-sys-noti.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin/notification')
@AdminCtrl('notifications')
export class NotificationAdminController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications() {
    return this.notificationService.getSysNotifications();
  }

  @Post()
  async createNotification(@Body() dto: CreateSysNotificationDto) {
    return this.notificationService.createSysNotification(dto);
  }

  @Patch(':id')
  async updateNotification(
    @Param('id') id: number,
    @Body() dto: UpdateSysNotificationDto,
  ) {
    return this.notificationService.updateSysNotification(id, dto);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: number) {
    return this.notificationService.deleteSysNotification(id);
  }
}
