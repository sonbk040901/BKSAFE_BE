import { Body, Get, Post, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { FindDriversDto } from './dto/find-drivers.dto';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user/map')
@UserCtrl('map')
export class MapUserController {
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

  @Get('api-key')
  getApiKey() {
    return this.mapService.getApiKey();
  }
}
