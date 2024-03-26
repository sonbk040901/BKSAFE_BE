import { BookingService } from './booking.service';
import { Get, Param, Post, Query } from '@nestjs/common';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { FindAllDto } from '@booking/dto/find-all.dto';
import { DriverCtrl } from '~decors/controller/controller.decorator';

@DriverCtrl('bookings')
export class DriverBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll(@CurrentAcc() account: Account, @Query() findAllDto: FindAllDto) {
    return this.bookingService.driverFindAll(account, findAllDto);
  }

  @Post(':id/accept')
  acceptBooking(@CurrentAcc() account: Account, @Param('id') id: number) {
    return this.bookingService.acceptBooking(account, id);
  }

  @Post(':id/reject')
  rejectBooking(@CurrentAcc() account: Account, @Param('id') id: number) {
    return this.bookingService.rejectBooking(account, id);
  }
}
