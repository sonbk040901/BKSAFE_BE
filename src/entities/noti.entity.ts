import { Column, Entity, JoinColumn } from 'typeorm';
import { BaseEntity } from '~entities/baseEntity';
import { Account } from '~entities/account.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column()
  ownerId: number;
  @JoinColumn({ name: 'owner_id' })
  owner: Account;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: false })
  isRead: boolean;
}
