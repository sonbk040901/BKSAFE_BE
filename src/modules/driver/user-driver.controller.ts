import { Body, Patch, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { UpdateDriverStatusDto } from '@driver/dto/update-driver-status.dto';

@DriverCtrl('drivers')
export class DriverDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return createDriverDto;
    // return this.driverService.create(createDriverDto);
  }
}
