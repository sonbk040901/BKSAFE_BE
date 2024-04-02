import { SetMetadata } from '@nestjs/common';
import { RoleType } from '~entities/role.entity';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLE_KEY, roles);
