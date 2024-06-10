import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { RoleName } from '~/common/enums/role-name.enum';
import { User } from '~entities/user.entity';
import { Driver } from '~entities/driver.entity';
import { Admin } from '~entities/admin.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ActivateStatus {
  DEACTIVATED = 'DEACTIVATED',
  ACTIVATED = 'ACTIVATED',
  BLOCKED = 'BLOCKED',
}

export abstract class Account extends BaseEntity {
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
  @Column({ nullable: true, length: 511 })
  avatar: string;
  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;
  @Column({
    type: 'enum',
    enum: ActivateStatus,
    default: ActivateStatus.DEACTIVATED,
  })
  activateStatus: ActivateStatus;

  isActivated(): boolean {
    return this.activateStatus === ActivateStatus.ACTIVATED;
  }

  isPending(): boolean {
    return this.activateStatus === ActivateStatus.DEACTIVATED;
  }

  isBlocked(): boolean {
    return this.activateStatus === ActivateStatus.BLOCKED;
  }

  abstract getRole(): RoleName;

  isUser(): this is User {
    return this.getRole() === RoleName.USER;
  }

  isDriver(): this is Driver {
    return this.getRole() === RoleName.DRIVER;
  }

  isAdmin(): this is Admin {
    return this.getRole() === RoleName.ADMIN;
  }
}
