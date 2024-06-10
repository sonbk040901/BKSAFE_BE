import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Car } from './car.entity';
import { Account } from './account.entity';
import { RoleName } from '~/common/enums/role-name.enum';
import { Notification } from '~entities/noti.entity';

@Entity('users')
export class User extends Account {
  @OneToOne(() => Car, { cascade: ['insert'] })
  @JoinColumn({ name: 'car_id' })
  car: Car;
  @ManyToMany(() => Notification)
  @JoinTable({
    name: 'user_notifications',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'notification_id' },
  })
  notifications: Notification[];

  getRole(): RoleName {
    return RoleName.USER;
  }
}
