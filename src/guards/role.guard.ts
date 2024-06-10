import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLE_KEY } from '~decors/meta/roles.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { PERMIT_KEY } from '~decors/meta/permit.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PERMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const roles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const account = context.switchToHttp().getRequest<Request>().user!;
    return roles.includes(account.getRole());
  }
}
