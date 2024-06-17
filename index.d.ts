import { type Account } from '~entities/account.entity';

declare global {
  namespace Express {
    interface Request {
      user: Account;
    }
  }
}
