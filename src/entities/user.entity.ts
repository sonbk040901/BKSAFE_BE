import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Car } from './car.entity';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @OneToOne(() => Account, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  account: Account;
  @OneToOne(() => Car, { cascade: ['insert'] })
  @JoinColumn({ name: 'car_id' })
  car: Car;
  @Exclude()
  @Column({ default: false })
  isActivated: boolean;
}
