import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUserController } from './profile.user.controller';
import { ProfileDriverController } from '~/modules/profile/profile.driver.controller';
import { ProfileAdminController } from '~/modules/profile/profile.admin.controller';

@Module({
  imports: [],
  controllers: [
    ProfileUserController,
    ProfileDriverController,
    ProfileAdminController,
  ],
  providers: [ProfileService],
})
export class ProfileModule {}
