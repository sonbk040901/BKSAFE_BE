import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MatchingStatistic } from '~entities/matching-statistic.entity';

@Injectable()
export class MatchingStatisticRepository extends Repository<MatchingStatistic> {
  constructor(dataSource: DataSource) {
    super(MatchingStatistic, dataSource.createEntityManager());
  }
}
