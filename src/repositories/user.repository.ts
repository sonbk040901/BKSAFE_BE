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

  async findOneByPhone(phone: string) {
    return this.createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .leftJoinAndSelect('account.roles', 'roles')
      .where('account.phone = :phone', { phone })
      .getOne();
  }

  async findOneByPhoneAndIsActivated(phone: string) {
    return this.createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .where('account.phone = :phone and user.isActivated = :isActivated', {
        phone,
        isActivated: true,
      })
      .getOne();
  }
}
