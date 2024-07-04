import { Injectable } from '@nestjs/common';
import { RoleName } from '~/common/enums/role-name.enum';
import { CreateSysNotificationDto } from '~/modules/notification/dto/create-sys-noti.dto';
import { PagingResponseDto } from '~dto/paging-response.dto';
import { NotificationRepository } from '~repos/noti.repository';
import { SystemNotificationRepository } from '~repos/system-noti.repository';
import { UpdateSysNotificationDto } from './dto/update-sys-noti.dto';

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
    void this.sysNotificationRepo.delete(id);
  }

  async getAllByUser(userId: number) {
    return this.getAll(RoleName.USER, userId);
  }

  async getAllByDriver(driverId: number) {
    return this.getAll(RoleName.DRIVER, driverId);
  }

  private async getAll(roleName: RoleName, accountId: number) {
    const sql = `SELECT n.title, n.content, n.image, n.updated_at, n.created_at, 'personal' as type FROM notifications n inner join users u on u.id = n.account_id where n.target = '${roleName}' and n.account_id = ${accountId} union SELECT  sn.title, sn.content, sn.image, sn.updated_at, sn.created_at, 'system' as type FROM system_notifications sn where sn.target = '${roleName}' OR sn.target = 'ALL' order by created_at desc`;
    const results: {
      title: string;
      content: string;
      image: string;
      updated_at: string;
      created_at: string;
      type: 'personal' | 'system';
    }[] = await this.notificationRepo.query(sql);
    return results.map(({ created_at, updated_at, ...rest }) => ({
      ...rest,
      createdAt: created_at,
      updatedAt: updated_at,
    }));
  }
}
