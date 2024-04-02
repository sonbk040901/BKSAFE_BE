import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { DrivingCostService } from './driving-cost.service';
import { DistanceService } from '~utils/distance.service';
import { CacheService } from '~utils/cache.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BcryptService, DrivingCostService, DistanceService, CacheService],
  exports: [BcryptService, DrivingCostService, DistanceService, CacheService],
})
export class UtilsModule {}
