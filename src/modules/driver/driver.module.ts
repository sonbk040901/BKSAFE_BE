import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverDriverController } from './driver-driver.controller';
import { UserDriverController } from '@driver/user-driver.controller';
import { AdminDriverController } from '@driver/admin-driver.controller';
import { DriverGateway } from './driver.gateway';
import { AuthModule } from '@auth/auth.module';
import { UtilsModule } from '~utils/utils.module';

@Module({
  imports: [AuthModule, UtilsModule],
  controllers: [
    AdminDriverController,
    DriverDriverController,
    UserDriverController,
  ],
  providers: [DriverService, DriverGateway],
})
export class DriverModule {}
