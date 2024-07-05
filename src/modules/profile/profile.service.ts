import { Injectable } from '@nestjs/common';
import { Account } from '~/entities/account.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCarDto } from '~/modules/profile/dto/update-car.dto';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';
import { AdminRepository } from '~/repositories/admin.repository';
import { UserRepository } from '~/repositories/user.repository';
import { DriverRepository } from '~/repositories/driver.repository';
import { BaseAccountService } from '~/common/services/base-account.service';

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
    const { avatar, fullName, gender, email } = updateProfileDto;
    const repo = this.getAccountRepository(account.getRole());
    return repo.update(account.id, {
      avatar,
      fullName,
      gender,
      email,
    });
  }

  updateCar(account: Account, updateCarDto: UpdateCarDto) {}

  updatePassword(account: Account, updatePasswordDto: UpdatePasswordDto) {}
}
