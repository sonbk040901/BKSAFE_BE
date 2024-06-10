import { Body, Patch } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverCtrl } from '~decors/controller/controller.decorator';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { UpdateDriverStatusDto } from '@driver/dto/update-driver-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { BookingGateway } from '@booking/booking.gateway';

@ApiTags('driver/drivers')
@DriverCtrl('drivers')
export class DriverDriverController {
  constructor(
    private driverService: DriverService,
    private bookingGateway: BookingGateway,
  ) {}

  @Patch('location')
  async updateLocation(
    @CurrentAcc('id') id: number,
    @Body() updateDriverLocationDto: UpdateDriverLocationDto,
  ) {
    const booking = await this.driverService.updateLocation(
      id,
      updateDriverLocationDto,
    );
    if (booking) this.bookingGateway.updateBooking(booking.userId, booking.id);
  }

  @Patch('status')
  updateStatus(
    @CurrentAcc('id') id: number,
    @Body() driverStatusDto: UpdateDriverStatusDto,
  ) {
    return this.driverService.updateStatus(id, driverStatusDto);
  }
}
