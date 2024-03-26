import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Account } from '../../../entities/account.entity';

export const CurrentAcc = createParamDecorator(
  (key: keyof Account | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return key ? request.user?.[key] : request.user;
  },
);
