import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Car } from './car.entity';
import { Account } from './account.entity';
import { RoleName } from '~/common/enums/role-name.enum';

@Entity('users')
export class User extends Account {
  @OneToOne(() => Car, { cascade: ['insert'] })
  @JoinColumn({ name: 'car_id' })
  car: Car;

  getRole(): RoleName {
    return RoleName.USER;
  }
}
