import { AuthService } from '@auth/auth.service';
import { WebSocketGateway } from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { BaseGateway } from '~/common/gateway/base.gateway';
import { BookingStatus } from '~/entities/booking.entity';
import { Account } from '~entities/account.entity';

@WebSocketGateway({ cors: '*', namespace: 'booking' })
export class BookingGateway extends BaseGateway {
  constructor(authService: AuthService) {
    super(authService);
  }

  updateBookingStatus(userId: number, status: BookingStatus) {
    this.server.to(userId.toString()).emit('current-status', status);
  }

  updateBookingDriver(userId: number, driver: Account) {
    this.server
      .to(userId.toString())
      .emit('current-driver', instanceToPlain(driver));
  }

  updateBooking(userId: number, bookingId: number) {
    this.server.to(userId.toString()).emit('current', bookingId);
  }

  updateCurrentDriverLocation(userId: number, location: unknown) {
    this.server.to(userId.toString()).emit('current-driver-location', location);
  }

  /**
   * Gửi thông báo đến `tài xế` về việc có một booking cần tài xế đó nhận
   * @param driverId
   * @param bookingId
   */
  suggestDriver(driverId: number, bookingId: number) {
    this.server.to(driverId.toString()).emit('suggest', bookingId);
  }

  /**
   * Gửi thông báo đến `admin` về việc có một booking cần tìm tài xế
   * @param driverId
   * @param bookingId
   */
  newPendingBooking(bookingId: number) {
    this.server.to('admin').emit('new-pending', bookingId);
  }

  /**
   * Gửi thông báo đến `admin` về việc có một booking đã được tự động chấp nhận
   * @param bookingId
   */
  newAcceptedBooking(bookingId: number) {
    this.server.to('admin').emit('new-accepted', bookingId);
  }
}
