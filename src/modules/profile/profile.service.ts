import { Injectable } from '@nestjs/common';
import { Account } from '~/entities/account.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCarDto } from '~/modules/profile/dto/update-car.dto';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';

@Injectable()
export class ProfileService {
  updateProfile(account: Account, updateProfileDto: UpdateProfileDto) {
    throw new Error('Method not implemented.');
  }

  updateCar(account: Account, updateCarDto: UpdateCarDto) {}

  updatePassword(account: Account, updatePasswordDto: UpdatePasswordDto) {}
}
