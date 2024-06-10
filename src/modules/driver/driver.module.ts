import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverDriverController } from './driver.driver.controller';
import { DriverUserController } from '@driver/driver.user.controller';
import { DriverAdminController } from '@driver/driver.admin.controller';
import { DriverGateway } from './driver.gateway';
import { AuthModule } from '@auth/auth.module';
import { UtilsModule } from '~utils/utils.module';
import { BookingModule } from '@booking/booking.module';

@Module({
  imports: [AuthModule, BookingModule, UtilsModule],
  controllers: [
    DriverAdminController,
    DriverDriverController,
    DriverUserController,
  ],
  providers: [DriverService, DriverGateway],
})
export class DriverModule {}
