import { Body, Get, Post, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { FindDriversDto } from './dto/find-drivers.dto';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('drivers')
  getDrivers(@Query() findDriversDto: FindDriversDto) {
    return this.mapService.findDrivers(findDriversDto);
  }

  @Get('cost')
  getCost(@Query() calculateCostDto: CalculateCostDto) {
    return this.mapService.calculateDrivingCost(calculateCostDto);
  }

  @Post('cost')
  getCostPost(@Body() calculateCostDto: CalculateCostDto) {
    return this.mapService.calculateDrivingCost(calculateCostDto);
  }
}
