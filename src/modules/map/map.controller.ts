import { Body, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { Permit } from '~decors/meta/permit.decorator';
import { FindDriversDto } from './dto/find-drivers.dto';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('drivers')
  getDrivers(@Query() findDriversDto: FindDriversDto) {
    return this.mapService.findDrivers(findDriversDto);
  }

  @Permit()
  @Get('cost')
  getCost(@Body() calculateCostDto: CalculateCostDto) {
    return this.mapService.calculateDrivingCost(calculateCostDto);
  }
}
