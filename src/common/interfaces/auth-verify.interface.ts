import { Account } from '~entities/account.entity';

export interface IAuthVerify {
  verify(token: string): Promise<Account>;
}
