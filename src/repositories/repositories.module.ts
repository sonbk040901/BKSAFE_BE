import { Module } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { RoleRepository } from './role.repository';
import { DriverRepository } from './driver.repository';
import { BookingRepository } from './booking.repository';
import { UserRepository } from '~repos/user.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    AccountRepository,
    RoleRepository,
    DriverRepository,
    BookingRepository,
    UserRepository,
  ],
  exports: [
    AccountRepository,
    RoleRepository,
    DriverRepository,
    BookingRepository,
    UserRepository,
  ],
})
export class RepositoriesModule {}
