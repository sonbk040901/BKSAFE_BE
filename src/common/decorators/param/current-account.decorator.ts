import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Account } from '~entities/account.entity';
import { Socket } from 'socket.io';

export const CurrentAcc = createParamDecorator(
  (key: keyof Account | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    let user = request.user;
    if (!user) {
      const client = ctx.switchToWs().getClient<Socket>();
      user = client.data.user;
    }
    return key ? user?.[key] : user;
  },
);
