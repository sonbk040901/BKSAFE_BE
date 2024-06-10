import { SetMetadata } from '@nestjs/common';
import { RoleName } from '~/common/enums/role-name.enum';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: (RoleName | Lowercase<RoleName>)[]) =>
  SetMetadata(ROLE_KEY, roles.map((role) => role.toUpperCase()) as RoleName[]);
