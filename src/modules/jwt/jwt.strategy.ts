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
import { UserRepository } from '~repos/user.repository';
import { DriverRepository } from '~repos/driver.repository';
import { AdminRepository } from '~repos/admin.repository';
import { RoleName } from '~/common/enums/role-name.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private driverRepository: DriverRepository,
    private adminRepository: AdminRepository,
  ) {
    const opt: StrategyOptionsWithoutRequest = {
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies['access_token'],
      ]),
    };
    super(opt);
  }

  protected getAccountRepository(role?: RoleName): AccountRepository {
    switch (role) {
      case 'USER':
        return this.userRepository;
      case 'DRIVER':
        return this.driverRepository;
      default:
        return this.adminRepository;
    }
  }

  async validate(authPayload: AuthPayload): Promise<Account> {
    const { id, role } = authPayload;
    const account = await this.getAccountRepository(role).findOne({
      where: { id },
    });
    if (!account) {
      throw new JwtTokenInvalidException();
    }
    return account;
  }
}
