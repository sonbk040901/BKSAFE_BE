import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CurrentAcc } from '~decors/param/current-account.decorator';
import { Account } from '~entities/account.entity';
import { AuthService } from '@auth/auth.service';
import { BaseGateway } from '~/common/gateway/base.gateway';

@WebSocketGateway({ cors: '*', namespace: 'booking' })
export class BookingGateway extends BaseGateway<AuthService> {
  constructor(authService: AuthService) {
    super(authService);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
    @CurrentAcc() currentAcc: Account,
  ): string {
    this.server.emit('message', { payload, from: currentAcc });
    return 'Hello world!';
  }

  updateBooking(userId: number, bookingId: number) {
    this.server.to(userId.toString()).emit('current', bookingId);
  }
}
