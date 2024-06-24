import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Setting } from '~entities/setting.entity';

@Injectable()
export class SettingRepository extends Repository<Setting> {
  constructor(dataSource: DataSource) {
    super(Setting, dataSource.createEntityManager());
  }
  override query<T>(
    query: string,
    parameters?: unknown[] | undefined,
  ): Promise<T[]> {
    return super.query(query, parameters);
  }
}
