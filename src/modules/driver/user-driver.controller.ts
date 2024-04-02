import { Body, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('drivers')
export class UserDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('')
  create(@Body() createDriverDto: CreateDriverDto) {
    return createDriverDto;
    // return this.driverService.create(createDriverDto);
  }
}
