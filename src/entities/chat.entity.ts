import { BaseEntity } from '~entities/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from '~entities/account.entity';

@Entity('chats')
export class Chat extends BaseEntity {
  @Column()
  userId: number;
  @Column()
  driverId: number;
  @Column()
  message: string;
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'user_id' })
  user: Account;
  @JoinColumn({ name: 'driver_id' })
  driver: Account;
}
