import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '~entities/user.entity';
import { AccountRepository } from '~repos/account.repository';

@Injectable()
export class UserRepository extends AccountRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
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
