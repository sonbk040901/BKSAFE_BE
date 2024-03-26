import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '~entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(
      User,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  async findOneByEmail(email: string) {
    return this.createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .innerJoinAndSelect('account.roles', 'roles')
      .where('account.email = :email', { email })
      .getOne();
  }
}
