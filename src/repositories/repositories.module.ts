import { Global, Module } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { RoleRepository } from './role.repository';
import { DriverRepository } from './driver.repository';
import { BookingRepository } from './booking.repository';
import { UserRepository } from '~repos/user.repository';
import { NoteRepository } from '~repos/note.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    AccountRepository,
    RoleRepository,
    DriverRepository,
    BookingRepository,
    UserRepository,
    NoteRepository,
  ],
  exports: [
    AccountRepository,
    RoleRepository,
    DriverRepository,
    BookingRepository,
    UserRepository,
    NoteRepository,
  ],
})
export class RepositoriesModule {}
