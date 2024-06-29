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
    this.emitToUser(userId, 'current-status', status);
  }

  updateBookingDriver(userId: number, driver: Account) {
    this.emitToUser(userId, 'current-driver', instanceToPlain(driver));
  }

  updateBooking(userId: number, bookingId: number) {
    this.emitToUser(userId, 'current', bookingId);
  }

  updateCurrentDriverLocation(userId: number, location: unknown) {
    this.emitToUser(userId, 'current-driver-location', location);
  }

  /**
   * Gửi thông báo đến `tài xế` về việc có một booking cần tài xế đó nhận
   * @param driverId
   * @param bookingId
   */
  suggestDriver(driverId: number, bookingId: number) {
    this.emitToDriver(driverId, 'suggest', bookingId);
  }

  /**
   * Gửi thông báo đến `admin` về việc có một booking cần tìm tài xế
   * @param driverId
   * @param bookingId
   */
  newPendingBooking(bookingId: number) {
    this.emitToAdmin('new-pending', bookingId);
  }

  /**
   * Gửi thông báo đến `admin` về việc có một booking đã được tự động chấp nhận
   * @param bookingId
   */
  newAcceptedBooking(bookingId: number) {
    this.emitToAdmin('new-accepted', bookingId);
  }
}
