import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Account } from '~entities/account.entity';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '~guards/ws-jwt.guard';

@UseGuards(WsJwtGuard)
export class BaseGateway<
    T extends { verify: (token: string) => Promise<Account> },
  >
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer() server: Server;

  constructor(protected authService: T) {}

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
        client.join(user.id.toString());
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
