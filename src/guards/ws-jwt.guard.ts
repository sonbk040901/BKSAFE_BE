import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const user = client.data.user;
    return Boolean(user);
  }
}
