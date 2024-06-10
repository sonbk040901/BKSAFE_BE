import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FindAllDto } from './dto/find-all.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActionRegisterDriverDto } from '@driver/dto/action-register-driver.dto';
import { ActionDriverDto } from "@driver/dto/action-driver.dto";

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

  @Patch(':id/action-register')
  async actionRegister(
    @Param('id') id: number,
    @Body() actionRegisterDriverDto: ActionRegisterDriverDto,
  ) {
    return this.driverService.actionRegister(id, actionRegisterDriverDto);
  }

  @Patch(':id/action-register')
  async action(
    @Param('id') id: number,
    @Body() actionDriverDto: ActionDriverDto,
  ) {
    return this.driverService.action(id, actionDriverDto);
  }
}
