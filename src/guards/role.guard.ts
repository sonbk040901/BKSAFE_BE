import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLE_KEY } from '~decors/meta/roles.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const user = context.switchToHttp().getRequest<Request>().user!;
    return roles.some((role) =>
      user['roles'].some((userRole: any) => userRole.name === role),
    );
  }
}
