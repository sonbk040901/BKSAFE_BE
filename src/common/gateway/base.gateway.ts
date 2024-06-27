import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '~guards/ws-jwt.guard';
import { IAuthVerify } from '~interfaces/auth-verify.interface';
import { RoleName } from '../enums/role-name.enum';
interface Options {
  /**
   * Namespace
   */
  nsp?: string;
}

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
    try {
      const account = await this.authService.verify(authToken);
      client.data.user = account;
      const role = account.getRole();
      if (role === RoleName.ADMIN) {
        client.join(RoleName.ADMIN);
        return;
      }
      client.join([role, `${role}${account.id}`]);
    } catch (error) {
      console.error(error);
      client.disconnect();
    }
  }

  private extractToken(client: Socket): string {
    return (
      client.handshake.auth?.token ||
      client.handshake.headers?.token ||
      client.handshake.headers.authorization
    );
  }

  emitToAdmin(event: string, data: unknown, opts?: Options) {
    this.emitToRole(RoleName.ADMIN, event, data, opts);
  }

  emitToRole(role: RoleName, event: string, data: unknown, opts?: Options) {
    this.applyOptions(opts).to(role).emit(event, data);
  }

  emitToUser(
    userId: number | undefined,
    event: string,
    data: unknown,
    opts?: Options,
  ) {
    this.applyOptions(opts)
      .to(`${RoleName.USER}${userId ?? ''}`)
      .emit(event, data);
  }

  emitToDriver(
    driverId: number | undefined,
    event: string,
    data: unknown,
    opts?: Options,
  ) {
    this.applyOptions(opts)
      .to(`${RoleName.DRIVER}${driverId ?? ''}`)
      .emit(event, data);
  }

  applyOptions(opts?: Options) {
    return opts?.nsp ? this.server.server.of(opts.nsp) : this.server;
  }
}
