import { Body, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from '~/modules/profile/dto/update-password.dto';
import { UpdateProfileDto } from '~/modules/profile/dto/update-profile.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { ProfileService } from './profile.service';
import { AdminCtrl } from '~decors/controller/controller.decorator';

@ApiTags('admin/profile')
@AdminCtrl('profile')
export class ProfileAdminController {
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
    return this.profileService.updateProfile(account, updateProfileDto);
  }

  @Patch('password')
  updatePassword(
    @CurrentAcc() account: Account,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.profileService.updatePassword(account, updatePasswordDto);
  }
}
