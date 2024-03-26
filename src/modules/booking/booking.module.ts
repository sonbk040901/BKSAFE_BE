import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { UserBookingController } from './user-booking.controller';
import { UtilsModule } from '~utils/utils.module';
import { RepositoriesModule } from '~repos/repositories.module';
import { AdminBookingController } from './admin-booking.controller';
import { DriverBookingController } from '@booking/driver-booking.controller';

@Module({
  imports: [RepositoriesModule, UtilsModule],
  controllers: [
    UserBookingController,
    AdminBookingController,
    DriverBookingController,
  ],
  providers: [BookingService],
})
export class BookingModule {}
