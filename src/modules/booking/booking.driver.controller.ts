import { BookingService } from './booking.service';
import { Get, Param, Patch, Query } from '@nestjs/common';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { FindAllDto } from '@booking/dto/find-all.dto';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { BookingGateway } from '@booking/booking.gateway';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('driver/bookings')
@DriverCtrl('bookings')
export class BookingDriverController {
  constructor(
    private bookingService: BookingService,
    private bookingGateway: BookingGateway,
  ) {}

  @Get()
  findAll(@CurrentAcc() account: Account, @Query() findAllDto: FindAllDto) {
    return this.bookingService.driverFindAll(account, findAllDto);
  }

  @Get('current')
  findCurrent(@CurrentAcc() account: Account) {
    return this.bookingService.driverFindCurrent(account);
  }

  @Get('receive')
  findOneReceive(@CurrentAcc() account: Account) {
    return this.bookingService.driverFindOneReceive(account);
  }

  @Get(':id')
  findOne(@CurrentAcc() account: Account, @Param('id') id: number) {
    return this.bookingService.driverFindOne(account, id);
  }

  @Patch(':id/accept')
  async acceptBooking(@CurrentAcc() account: Account, @Param('id') id: number) {
    const [booking, driver] = await this.bookingService.acceptBooking(
      account,
      id,
    );
    this.bookingGateway.updateBooking(booking.userId, booking.id);
    this.bookingGateway.updateBookingDriver(booking.userId, driver);
    this.bookingGateway.updateBookingStatus(booking.userId, booking.status);
    return booking;
  }

  @Patch(':id/reject')
  async rejectBooking(
    @CurrentAcc('id') driverId: number,
    @Param('id') id: number,
  ) {
    await this.bookingService.rejectBooking(driverId, id);
    this.bookingGateway.newPendingBooking(id);
  }

  @Patch(':id/start')
  async startBooking(@CurrentAcc() account: Account, @Param('id') id: number) {
    const booking = await this.bookingService.startBooking(account, id);
    this.bookingGateway.updateBooking(booking.userId, booking.id);
    this.bookingGateway.updateBookingStatus(booking.userId, booking.status);
    return booking;
  }

  @Patch(':id/complete')
  async completeBooking(
    @CurrentAcc() account: Account,
    @Param('id') id: number,
  ) {
    const booking = await this.bookingService.completeBooking(account, id);
    this.bookingGateway.updateBooking(booking.userId, booking.id);
    this.bookingGateway.updateBookingStatus(booking.userId, booking.status);
    return booking;
  }
}
