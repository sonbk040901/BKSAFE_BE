import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~entities/base.entity';

export enum NotificationTarget {
  DRIVER = 'DRIVER',
  USER = 'USER',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column({ type: 'enum', enum: NotificationTarget })
  target: NotificationTarget;
  @Column()
  accountId: number;
}
