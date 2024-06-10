import { BaseEntity } from '~entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '~entities/user.entity';
import { Driver } from '~entities/driver.entity';

@Entity('chats')
export class Chat extends BaseEntity {
  @Column()
  userId: number;
  @Column()
  driverId: number;
  @Column()
  message: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
