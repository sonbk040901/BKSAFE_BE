import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PERMIT_KEY } from '~decors/meta/permit.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PERMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic || super.canActivate(context);
  }
}
