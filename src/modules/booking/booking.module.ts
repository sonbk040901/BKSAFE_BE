import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { UserBookingController } from './user-booking.controller';
import { UtilsModule } from '~utils/utils.module';
import { AdminBookingController } from './admin-booking.controller';
import { DriverBookingController } from '@booking/driver-booking.controller';
import { BookingGateway } from './booking.gateway';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [UtilsModule, AuthModule],
  controllers: [
    UserBookingController,
    AdminBookingController,
    DriverBookingController,
  ],
  providers: [BookingService, BookingGateway],
})
export class BookingModule {}
