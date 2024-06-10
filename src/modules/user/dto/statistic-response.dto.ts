import { IStatisticRecord } from '../interfaces/statistic.interface';

export class StatisticResponseDto {
  deactivated: number;
  activated: number;
  blocked: number;
  total: number;
  constructor(statisctics: IStatisticRecord[]) {
    this.deactivated = +(
      statisctics.find(
        (statistic) => statistic.activateStatus === 'DEACTIVATED',
      )?.count || 0
    );
    this.activated = +(
      statisctics.find((statistic) => statistic.activateStatus === 'ACTIVATED')
        ?.count || 0
    );
    this.blocked = +(
      statisctics.find((statistic) => statistic.activateStatus === 'BLOCKED')
        ?.count || 0
    );
    this.total = this.activated + this.deactivated + this.blocked;
  }
}
