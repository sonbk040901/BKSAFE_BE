import { UserRepository } from '~repos/user.repository';
import { DriverRepository } from '~repos/driver.repository';
import { AdminRepository } from '~repos/admin.repository';
import { RoleName } from '~/common/enums/role-name.enum';
import { AccountRepository } from '~repos/account.repository';

export abstract class BaseAccountService {
  protected constructor(
    protected userRepository: UserRepository,
    protected driverRepository: DriverRepository,
    protected adminRepository: AdminRepository,
  ) {}

  protected getAccountRepository(role?: RoleName): AccountRepository {
    switch (role) {
      case 'USER':
        return this.userRepository;
      case 'DRIVER':
        return this.driverRepository;
      case 'ADMIN':
        return this.adminRepository;
      default:
        return this.userRepository;
    }
  }
}
