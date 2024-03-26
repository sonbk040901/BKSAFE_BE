import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity('accounts')
export class Account extends BaseEntity {
  @Column()
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  fullName: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;
  @ManyToMany(() => Role, { nullable: false })
  @JoinTable({
    name: 'account_roles',
    joinColumn: { name: 'account_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  @Exclude()
  roles: Role[];
}
