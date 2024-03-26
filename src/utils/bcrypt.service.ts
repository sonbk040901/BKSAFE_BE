import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds: number;
  private salt?: string;

  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS!);
  }

  async hash(password: string) {
    if (!this.salt) {
      this.salt = await this.genSalt();
    }
    return bcrypt.hash(password, this.salt);
  }

  compare(plainText: string, hash: string) {
    return bcrypt.compare(plainText, hash);
  }

  genSalt() {
    return bcrypt.genSalt(this.saltRounds);
  }
}
