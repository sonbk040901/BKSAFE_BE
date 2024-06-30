import { Account } from '~entities/account.entity';
import { RoleName } from '../enums/role-name.enum';

export interface IAuthVerify {
  verify(token: string): Promise<Account>;
  logout(role: RoleName, id: number): void;
}
