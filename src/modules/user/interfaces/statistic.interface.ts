import { ActivateStatus } from '~/entities/account.entity';

export interface IStatisticRecord {
  activateStatus: ActivateStatus;
  count: string;
}
