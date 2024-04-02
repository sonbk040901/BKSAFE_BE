import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverDriverController } from './driver-driver.controller';
import { UserDriverController } from '@driver/user-driver.controller';
import { AdminDriverController } from '@driver/admin-driver.controller';

@Module({
  imports: [],
  controllers: [
    AdminDriverController,
    DriverDriverController,
    UserDriverController,
  ],
  providers: [DriverService],
})
export class DriverModule {}
