import { Account } from '~entities/account.entity';
import { DataSource, EntityTarget, FindOneOptions, Repository } from 'typeorm';

export abstract class AccountRepository<
  T extends Account = Account,
> extends Repository<T> {
  protected constructor(accEntity: EntityTarget<T>, dataSource: DataSource) {
    super(
      accEntity,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  findOneByPhone(phone: string): Promise<T | null> {
    return this.findOne({ where: { phone } } as FindOneOptions<T>);
  }

  query<T>(query: string, parameters?: any[]): Promise<T[]> {
    return super.query(query, parameters);
  }
}
