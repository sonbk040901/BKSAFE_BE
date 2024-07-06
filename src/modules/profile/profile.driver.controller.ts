import { Body, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('driver/profile')
@DriverCtrl('profile')
export class ProfileDriverController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentAcc() account: Account) {
    return account;
  }

  @Patch()
  updateProfile(
    @CurrentAcc() account: Account,
    @Body() updateProfileDto: UpdateDriverProfileDto,
  ) {
    return this.profileService.updateDriverProfile(account, updateProfileDto);
  }

  @Patch('password')
  updatePassword(
    @CurrentAcc() account: Account,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.profileService.updatePassword(account, updatePasswordDto);
  }
}
