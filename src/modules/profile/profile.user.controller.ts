import { Body, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCarDto } from '~/modules/profile/dto/update-car.dto';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';
import { UpdateProfileDto } from '~/modules/profile/dto/update-profile.dto';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { ProfileService } from './profile.service';

@ApiTags('user/profile')
@UserCtrl('profile')
export class ProfileUserController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentAcc() account: Account) {
    return account;
  }

  @Patch()
  updateProfile(
    @CurrentAcc() account: Account,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateUserProfile(account, updateProfileDto);
  }

  @Patch('car')
  updateCar(
    @CurrentAcc() account: Account,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.profileService.updateCar(account, updateCarDto);
  }

  @Patch('password')
  updatePassword(
    @CurrentAcc() account: Account,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.profileService.updatePassword(account, updatePasswordDto);
  }
}
