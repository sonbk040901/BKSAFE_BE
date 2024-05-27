import { Injectable } from '@nestjs/common';
import { Account } from '~entities/account.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  findById(id: number, relations: string[] = []) {
    return this.findOne({ where: { id }, relations });
  }

  findOneByEmail(email: string, relations: string[] = []) {
    return this.findOne({
      where: { email },
      relations,
    });
  }

  findOneByPhone(phone: string, relations: string[] = []) {
    return this.findOne({
      where: { phone },
      relations,
    });
  }

  // findOneByPhoneAndActiveted(phone: string, relations: string[] = []) {
  //   return this.findOne({
  //     where: { phone, : true },
  //     relations,
  //   });
  // }

  existsByEmail(email: string) {
    return this.existsBy({ email });
  }

  saveUser({ username, password, email, fullName, phone, avatar }: Account) {
    return this.query('call create_user(?,?,?,?,?,?)', [
      username,
      password,
      email,
      fullName,
      phone,
      avatar,
    ]);
  }
}
