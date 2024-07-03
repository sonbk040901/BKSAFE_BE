import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '~repos/noti.repository';
import { SystemNotificationRepository } from '~repos/system-noti.repository';
import { UpdateSysNotificationDto } from './dto/update-sys-noti.dto';
import { CreateSysNotificationDto } from '~/modules/notification/dto/create-sys-noti.dto';
import { PagingResponseDto } from '~dto/paging-response.dto';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private sysNotificationRepo: SystemNotificationRepository,
  ) {}

  async getSysNotifications() {
    const notifications = await this.sysNotificationRepo.find();
    return new PagingResponseDto(notifications, notifications.length);
  }

  createSysNotification(dto: CreateSysNotificationDto) {
    return this.sysNotificationRepo.save(dto);
  }

  updateSysNotification(id: number, dto: UpdateSysNotificationDto) {
    return this.sysNotificationRepo.update(id, dto);
  }

  deleteSysNotification(id: number) {
    void this.notificationRepo.delete(id);
  }
}
