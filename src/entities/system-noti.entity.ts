import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~entities/base.entity';

export enum SystemNotificationTarget {
  DRIVER = 'DRIVER',
  USER = 'USER',
  ALL = 'ALL',
}

@Entity('system_notifications')
export class SystemNotification extends BaseEntity {
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  image: string;
  @Column({
    type: 'enum',
    enum: SystemNotificationTarget,
    default: SystemNotificationTarget.ALL,
  })
  target: SystemNotificationTarget;
}
