import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';

@Entity('admins')
export class Admin extends BaseEntity {
  @OneToOne(() => Account, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  account: Account;
  @Exclude()
  @Column({ default: false })
  isActivated: boolean;
}
