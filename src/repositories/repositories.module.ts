import { Global, Module } from '@nestjs/common';
import { DriverRepository } from './driver.repository';
import { BookingRepository } from './booking.repository';
import { UserRepository } from '~repos/user.repository';
import { NoteRepository } from '~repos/note.repository';
import { BookingSuggestDriverRepository } from '~repos/booking-suggest-driver.repository';
import { MatchingStatisticRepository } from '~repos/matching-statistic.repository';
import { AdminRepository } from '~repos/admin.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    DriverRepository,
    BookingRepository,
    UserRepository,
    NoteRepository,
    AdminRepository,
    BookingSuggestDriverRepository,
    MatchingStatisticRepository,
  ],
  exports: [
    DriverRepository,
    BookingRepository,
    UserRepository,
    AdminRepository,
    NoteRepository,
    BookingSuggestDriverRepository,
    MatchingStatisticRepository,
  ],
})
export class RepositoriesModule {}
