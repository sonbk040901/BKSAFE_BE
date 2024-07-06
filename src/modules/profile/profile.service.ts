import { Injectable } from '@nestjs/common';
import { BaseAccountService } from '~/common/services/base-account.service';
import { Account } from '~/entities/account.entity';
import { UpdateCarDto } from '~/modules/profile/dto/update-car.dto';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';
import { AdminRepository } from '~/repositories/admin.repository';
import { DriverRepository } from '~/repositories/driver.repository';
import { UserRepository } from '~/repositories/user.repository';
import { extract } from '~/utils/common';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService extends BaseAccountService {
  constructor(
    driverRepository: DriverRepository,
    userRepository: UserRepository,
    adminRepository: AdminRepository,
  ) {
    super(userRepository, driverRepository, adminRepository);
  }

  updateProfile(account: Account, updateProfileDto: UpdateProfileDto) {
    const repo = this.getAccountRepository(account.getRole());
    return repo.update(account.id, updateProfileDto);
  }

  updateUserProfile(account: Account, updateProfileDto: UpdateProfileDto) {
    const extracted = extract(updateProfileDto, [
      'avatar',
      'email',
      'fullName',
      'gender',
    ]);
    return this.updateProfile(account, extracted);
  }

  updateDriverProfile(
    account: Account,
    updateProfileDto: UpdateDriverProfileDto,
  ) {
    const extracted = extract(updateProfileDto, [
      'avatar',
      'email',
      'fullName',
      'birthday',
      'address',
    ]);
    return this.updateProfile(account, extracted);
  }

  updateCar(account: Account, updateCarDto: UpdateCarDto) {}

  updatePassword(account: Account, updatePasswordDto: UpdatePasswordDto) {}
}
