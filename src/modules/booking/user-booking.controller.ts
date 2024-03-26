import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { FindAllDto } from './dto/find-all.dto';
import { Account } from '~entities/account.entity';
import { UserCtrl } from '~decors/controller/controller.decorator';

@UserCtrl('bookings')
export class UserBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentAcc('id') userId: number,
  ) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get()
  findAll(@CurrentAcc() account: Account, @Query() findAllDto: FindAllDto) {
    return this.bookingService.userFindAll(account, findAllDto);
  }

  @Get(':id')
  findOne(@CurrentAcc('id') userId: number, @Param('id') bookingId: number) {
    return this.bookingService.findOne(bookingId, userId);
  }

  @Get(['recent', 'recents'])
  getRecent(@CurrentAcc('id') userId: number) {
    return this.bookingService.getRecent(userId);
  }

  @Patch(':id/cancel')
  cancel(@CurrentAcc('id') userId: number, @Param('id') bookingId: number) {
    return this.bookingService.cancel(userId, bookingId);
  }

  @Get('mode')
  getFindDriverMode() {
    return this.bookingService.getFindDriverMode();
  }
}
