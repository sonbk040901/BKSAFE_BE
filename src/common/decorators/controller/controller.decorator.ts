import { applyDecorators, Controller } from '@nestjs/common';
import { Roles } from '~decors/meta/roles.decorator';

export function AdminCtrl(prefix: string) {
  return applyDecorators(Controller(`admin/${prefix}`), Roles('admin'));
}

export function UserCtrl(prefix: string) {
  return applyDecorators(Controller(prefix), Roles('user'));
}

export function DriverCtrl(prefix: string) {
  return applyDecorators(Controller(`driver/${prefix}`), Roles('driver'));
}
