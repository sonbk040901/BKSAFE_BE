import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '~guards/ws-jwt.guard';
import { IAuthVerify } from '~interfaces/auth-verify.interface';

@UseGuards(WsJwtGuard)
export class BaseGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer() server: Namespace;

  constructor(protected authService: IAuthVerify) {}

  handleDisconnect(client: Socket) {
    console.log(`disconnected ${client.nsp.name}`);
    if (client.data.user) {
      client.leave(client.data.user.id.toString());
    }
  }

  async handleConnection(client: Socket) {
    console.log(`connected ${client.nsp.name}`);
    const authToken = this.extractToken(client);
    client.data.user = await this.authService
      .verify(authToken)
      .then((user) => {
        const isAdmin = user.getRole() === 'ADMIN';
        if (isAdmin) {
          console.log('admin join');
          client.join('admin');
        } else client.join(user.id.toString());
        return user;
      })
      .catch(() => client.disconnect());
  }

  private extractToken(client: Socket): string {
    return (
      client.handshake.auth?.token ||
      client.handshake.headers?.token ||
      client.handshake.headers.authorization
    );
  }
}
