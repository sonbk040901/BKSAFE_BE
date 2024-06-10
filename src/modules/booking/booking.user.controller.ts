import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { FindAllDto } from './dto/find-all.dto';
import { Account } from '~entities/account.entity';
import { UserCtrl } from '~decors/controller/controller.decorator';
import { BookingGateway } from '@booking/booking.gateway';
import { RatingDto } from '@booking/dto/rating.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user/bookings')
@UserCtrl('bookings')
export class BookingUserController {
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
    const bookingId = booking.id;
    if (!this.bookingService.getAutoFindDriver()) {
      this.bookingGateway.updateBooking(userId, bookingId);
      this.bookingGateway.newPendingBooking(bookingId);
      return booking;
    }
    this.bookingGateway.updateBooking(userId, bookingId);
    this.bookingGateway.newAcceptedBooking(bookingId);
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
  findOne(@CurrentAcc('id') userId: number, @Param('id') bookingId: number) {
    return this.bookingService.findOne(bookingId, userId);
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentAcc('id') userId: number,
    @Param('id') bookingId: number,
  ) {
    const booking = await this.bookingService.cancel(userId, bookingId);
    this.bookingGateway.updateBooking(userId, bookingId);
    return booking;
  }

  @Post('rating')
  rate(@CurrentAcc('id') userId: number, @Body() ratingDto: RatingDto) {
    return this.bookingService.rate(userId, ratingDto);
  }
}
