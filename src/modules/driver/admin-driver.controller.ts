import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FindAllDto } from './dto/find-all.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin/drivers')
@AdminCtrl('drivers')
export class AdminDriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return createDriverDto;
    // return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto) {
    return this.driverService.findAll(findAllDto);
  }

  @Get('statistic')
  statistic() {
    return this.driverService.statistic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
