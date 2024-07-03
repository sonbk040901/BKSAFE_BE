import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SystemNotification } from '~entities/system-noti.entity';

@Injectable()
export class SystemNotificationRepository extends Repository<SystemNotification> {
  constructor(dataSource: DataSource) {
    super(SystemNotification, dataSource.createEntityManager());
  }
}
