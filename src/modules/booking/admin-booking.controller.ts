import { BookingService } from './booking.service';
import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FindAllDto } from '@booking/dto/find-all.dto';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { ChangeFindDriverModeDto } from '@booking/dto/change-find-driver-mode.dto';

@AdminCtrl('bookings')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll(@Query() findAllDto: FindAllDto) {
    return this.bookingService.findAll(findAllDto);
  }

  @Patch('mode')
  changeFindDriverMode(@Body() changeModeDto: ChangeFindDriverModeDto) {
    return this.bookingService.changeFindDriverMode(changeModeDto);
  }

  @Post(':id/reject')
  rejectBooking(@Param('id') bookingId: number) {
    return this.bookingService.reject(bookingId);
  }

  @Get(':id/suggest/drivers')
  getSuggestDrivers(@Param('id') bookingId: number) {
    return this.bookingService.getSuggestDrivers(bookingId);
  }

  @Post(':id/suggest/:driverId')
  suggestDriver(
    @Param('id') bookingId: number,
    @Param('driverId') driverId: number,
  ) {
    return this.bookingService.suggestDriver(bookingId, driverId);
  }
}