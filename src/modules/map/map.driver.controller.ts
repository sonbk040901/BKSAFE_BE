import { ApiTags } from '@nestjs/swagger';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { MapService } from './map.service';
import { Get } from '@nestjs/common';

@ApiTags('driver/map')
@DriverCtrl('map')
export class MapDriverController {
  constructor(private readonly mapService: MapService) {}

  @Get('api-key')
  getApiKey() {
    return this.mapService.getApiKey();
  }
}
