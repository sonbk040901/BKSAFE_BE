import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { AuthPayload } from '@auth/interfaces/auth-payload.interface';
import { AccountRepository } from '~repos/account.repository';
import { JwtTokenInvalidException } from '~/common/exceptions/httpException';
import { Account } from '~entities/account.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private accountRepository: AccountRepository) {
    const opt: StrategyOptionsWithoutRequest = {
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies['access_token'],
      ]),
    };
    super(opt);
  }

  async validate(authPayload: AuthPayload): Promise<Account> {
    const { id } = authPayload;
    const account = await this.accountRepository.findById(id, ['roles']);
    if (!account) {
      throw new JwtTokenInvalidException();
    }
    return account;
  }
}
