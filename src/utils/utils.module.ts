import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { DrivingCostService } from './driving-cost.service';
import { DistanceService } from '~utils/distance.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BcryptService, DrivingCostService, DistanceService],
  exports: [BcryptService, DrivingCostService, DistanceService],
})
export class UtilsModule {}
