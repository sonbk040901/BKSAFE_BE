import { RoleName } from '~/common/enums/role-name.enum';

export interface AuthPayload {
  id: number;
  role: RoleName;
}
