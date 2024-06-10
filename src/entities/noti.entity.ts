import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~entities/base.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: false })
  isRead: boolean;
}
