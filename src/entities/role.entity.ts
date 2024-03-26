import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

export type RoleType = 'user' | 'admin' | 'driver';

@Entity('roles')
export class Role extends BaseEntity {
  @Column()
  name: RoleType;
  @Column()
  description: string;
  @Column()
  isActivated: boolean;
}
