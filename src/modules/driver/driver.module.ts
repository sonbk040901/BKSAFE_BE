import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverDriverController } from './driver-driver.controller';
import { RepositoriesModule } from '~repos/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [DriverDriverController],
  providers: [DriverService],
})
export class DriverModule {}
