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
import { CurrentAcc } from '~/common/decorators/param/current-account.decorator';

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
    @CurrentAcc() driver: Account,
  ) {
    const booking = await this.driverService.updateLocation(driver.id, payload);
    if (!booking) return;
    this.server.server
      .of('booking')
      .to(booking.userId.toString())
      .emit('current-driver-location', payload);
  }
}
