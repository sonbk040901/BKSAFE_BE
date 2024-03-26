import { Account } from './src/entities/account.entity';

declare global {
  namespace Express {
    interface Request {
      user: Account;
    }
  }
}
