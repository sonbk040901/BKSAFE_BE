import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Admin } from '~entities/admin.entity';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(dataSource: DataSource) {
    super(
      Admin,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  async findOneByPhoneAndIsActivated(phone: string) {
    return this.createQueryBuilder('admin')
      .innerJoinAndSelect('admin.account', 'account')
      .where('account.phone = :phone and admin.isActivated = true', { phone })
      .getOne();
  }

  async findOneByPhone(phone: string) {
    return this.createQueryBuilder('admin')
      .innerJoinAndSelect('admin.account', 'account')
      .leftJoinAndSelect('account.roles', 'roles')
      .where('account.phone = :phone', { phone })
      .getOne();
  }
}
