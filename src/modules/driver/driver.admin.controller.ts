import { ActionDriverDto } from '@driver/dto/action-driver.dto';
import { ActionRegisterDriverDto } from '@driver/dto/action-register-driver.dto';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { FindAllDto } from './dto/find-all.dto';
import { GetDriverStatisticDto } from './dto/get-driver-statistic.dto';

@ApiTags('admin/drivers')
@AdminCtrl('drivers')
export class DriverAdminController {
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

  @Get('register')
  findAllRegister(@Query() findAllDto: FindAllDto) {
    return this.driverService.findAllRegister(findAllDto);
  }

  @Get('statistic')
  statistic() {
    return this.driverService.statistic();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.driverService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }

  @Patch(':id/action-register')
  async actionRegister(
    @Param('id') id: number,
    @Body() actionRegisterDriverDto: ActionRegisterDriverDto,
  ) {
    return this.driverService.actionRegister(id, actionRegisterDriverDto);
  }

  @Patch(':id/action')
  async action(
    @Param('id') id: number,
    @Body() actionDriverDto: ActionDriverDto,
  ) {
    return this.driverService.action(id, actionDriverDto);
  }

  @Get(':id/statistic')
  async getStatisticByDriver(
    @Param('id') id: number,
    @Query() statisticDto: GetDriverStatisticDto,
  ) {
    return this.driverService.getStatitsticByDriver(id, statisticDto.month);
  }

  @Get(':id/bookings')
  async getBookings(
    @Param('id') id: number,
    @Query() statisticDto: GetDriverStatisticDto,
  ) {
    return this.driverService.getBookings(id, statisticDto.month);
  }
}
