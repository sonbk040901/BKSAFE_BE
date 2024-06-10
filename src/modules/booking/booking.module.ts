import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingUserController } from './booking.user.controller';
import { UtilsModule } from '~utils/utils.module';
import { BookingAdminController } from './booking.admin.controller';
import { BookingDriverController } from '@booking/booking.driver.controller';
import { BookingGateway } from './booking.gateway';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [UtilsModule, AuthModule],
  controllers: [
    BookingUserController,
    BookingAdminController,
    BookingDriverController,
  ],
  providers: [BookingService, BookingGateway],
  exports: [BookingGateway],
})
export class BookingModule {}
