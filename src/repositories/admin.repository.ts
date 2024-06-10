import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from '~entities/admin.entity';
import { AccountRepository } from '~repos/account.repository';

@Injectable()
export class AdminRepository extends AccountRepository<Admin> {
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
  }
}
