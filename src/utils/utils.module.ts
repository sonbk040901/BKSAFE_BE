import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { DrivingCostService } from './driving-cost.service';
import { DistanceService } from '~utils/distance.service';
import { CacheService } from '~utils/cache.service';
import { DriverPriorityService } from '~utils/driver-priority.service';

@Module({
  imports: [],
  providers: [
    BcryptService,
    DrivingCostService,
    DistanceService,
    CacheService,
    DriverPriorityService,
  ],
  exports: [
    BcryptService,
    DrivingCostService,
    DistanceService,
    CacheService,
    DriverPriorityService,
  ],
})
export class UtilsModule {}
