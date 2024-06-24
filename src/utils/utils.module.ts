import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { DrivingCostService } from './driving-cost.service';
import { DistanceService } from '~utils/distance.service';
import { CacheService } from '~utils/cache.service';
import { DriverPriorityService } from '~utils/driver-priority.service';
import { PriorityService } from './priority.service';

@Module({
  imports: [],
  providers: [
    BcryptService,
    DrivingCostService,
    DistanceService,
    CacheService,
    DriverPriorityService,
    PriorityService,
  ],
  exports: [
    BcryptService,
    DrivingCostService,
    DistanceService,
    CacheService,
    DriverPriorityService,
    PriorityService,
  ],
})
export class UtilsModule {}
