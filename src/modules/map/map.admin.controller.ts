import { Body, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { MapService } from './map.service';

@ApiTags('admin/map')
@AdminCtrl('map')
export class MapAdminController {
  constructor(private readonly mapService: MapService) {}

  @Get('api-key')
  getApiKey() {
    return this.mapService.getApiKey();
  }

  @Patch('api-key')
  updateApiKey(@Body('key') key: string) {
    return this.mapService.updateApiKey(key);
  }
}
