import { Entity } from 'typeorm';
import { Account } from '~entities/account.entity';
import { RoleName } from '~/common/enums/role-name.enum';

@Entity('admins')
export class Admin extends Account {
  getRole(): RoleName {
    return RoleName.ADMIN;
  }
}
