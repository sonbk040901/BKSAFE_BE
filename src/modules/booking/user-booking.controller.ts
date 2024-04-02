import {
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { FindAllDto } from './dto/find-all.dto';
import { Account } from '~entities/account.entity';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { BookingGateway } from '@booking/booking.gateway';

@UserCtrl('bookings')
export class UserBookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingGateway: BookingGateway,
  ) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentAcc('id') userId: number,
  ) {
    const booking = await this.bookingService.create(createBookingDto, userId);
    this.bookingGateway.updateBooking(userId, booking.id);
    return booking;
  }

  @Get()
  findAll(@CurrentAcc() account: Account, @Query() findAllDto: FindAllDto) {
    return this.bookingService.userFindAll(account, findAllDto);
  }

  @Get(['recent', 'recents'])
  getRecent(@CurrentAcc('id') userId: number) {
    return this.bookingService.getRecent(userId);
  }

  @Get('mode')
  getFindDriverMode() {
    return this.bookingService.getFindDriverMode();
  }

  @Get(':id')
  findOne(
    @CurrentAcc('id') userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    return this.bookingService.findOne(bookingId, userId);
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentAcc('id') userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    const booking = await this.bookingService.cancel(userId, bookingId);
    this.bookingGateway.updateBooking(userId, bookingId);
    return booking;
  }
}
