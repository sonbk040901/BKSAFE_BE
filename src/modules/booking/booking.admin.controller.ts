import { BookingService } from './booking.service';
import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FindAllDto } from '@booking/dto/find-all.dto';
import { AdminCtrl } from '~decors/controller/controller.decorator';
import { ChangeFindDriverModeDto } from '@booking/dto/change-find-driver-mode.dto';
import { BookingGateway } from '@booking/booking.gateway';
import { FindSuggestDriverDto } from '@booking/dto/find-suggest-driver.dto';
import { BookingStatus } from '~/entities/booking.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin/bookings')
@AdminCtrl('bookings')
export class BookingAdminController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingGateway: BookingGateway,
  ) {}

  @Get()
  findAll(@Query() findAllDto: FindAllDto) {
    return this.bookingService.findAll(findAllDto);
  }

  @Get('statistic')
  getStatistic() {
    return this.bookingService.getStatistic();
  }

  @Get('mode')
  getFindDriverMode() {
    return this.bookingService.getFindDriverMode();
  }

  @Patch('mode')
  changeFindDriverMode(@Body() changeModeDto: ChangeFindDriverModeDto) {
    return this.bookingService.changeFindDriverMode(changeModeDto);
  }

  @Patch(':id/reject')
  async rejectBooking(@Param('id') bookingId: number) {
    const userId = await this.bookingService.reject(bookingId);
    this.bookingGateway.updateBooking(userId, bookingId);
    this.bookingGateway.updateBookingStatus(userId, BookingStatus.REJECTED);
  }

  @Get(':id/suggest/drivers')
  getSuggestDrivers(
    @Param('id') bookingId: number,
    @Query() suggestDriverDto: FindSuggestDriverDto,
  ) {
    return this.bookingService.getSuggestDrivers(bookingId, suggestDriverDto);
  }

  @Post(':id/suggest/:driverId')
  async suggestDriver(
    @Param('id') bookingId: number,
    @Param('driverId') driverId: number,
  ) {
    const booking = await this.bookingService.suggestDriver(
      bookingId,
      driverId,
    );
    this.bookingGateway.suggestDriver(driverId, bookingId);
    this.bookingGateway.updateBooking(booking.userId, bookingId);
  }
}
