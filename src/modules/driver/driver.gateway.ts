import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { BaseGateway } from '~/common/gateway/base.gateway';
import { AuthService } from '@auth/auth.service';
import { Socket } from 'socket.io';
import { UpdateDriverLocationDto } from '@driver/dto/update-driver-location.dto';
import { Account } from '~entities/account.entity';
import { DriverService } from '@driver/driver.service';

@WebSocketGateway({ cors: '*', namespace: 'driver' })
export class DriverGateway extends BaseGateway<AuthService> {
  constructor(
    authService: AuthService,
    private driverService: DriverService,
  ) {
    super(authService);
  }

  @SubscribeMessage('update-location')
  async handleUpdateLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: UpdateDriverLocationDto,
  ) {
    const driver: Account = client.data.user;
    const booking = await this.driverService.updateLocation(driver.id, payload);
    if (!booking) return;
    this.server.server
      .of('booking')
      .to(booking.userId.toString())
      .emit('current', booking.id);
  }
}
