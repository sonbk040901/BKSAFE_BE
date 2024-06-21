import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindAllDto } from '~/modules/driver/dto/find-all.dto';
import { Driver, DriverStatus, RegisterStatus } from '~entities/driver.entity';
import { AccountRepository } from '~repos/account.repository';

@Injectable()
export class DriverRepository extends AccountRepository<Driver> {
  constructor(dataSource: DataSource) {
    super(Driver, dataSource);
  }

  findAll(findAllDto: FindAllDto, relations?: string[]) {
    return this.findAndCount({
      where: {
        registerStatus: RegisterStatus.ACCEPTED,
      },
      order: {
        [findAllDto.sort]: findAllDto.order,
      },
      take: findAllDto.take,
      skip: findAllDto.skip,
      relations,
    });
  }

  findAllAvailableDrivers(relations?: string[]) {
    return this.find({
      where: {
        status: DriverStatus.AVAILABLE,
      },
      relations,
    });
  }

  findById(id: number) {
    return this.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return this.createQueryBuilder('driver')
      .innerJoinAndSelect('driver.account', 'account')
      .innerJoinAndSelect('account.roles', 'roles')
      .where('account.email = :email', { email })
      .getOne();
  }

  async findOneByPhoneAndIsActivated(phone: string) {
    return this.createQueryBuilder('driver')
      .innerJoinAndSelect('driver.account', 'account')
      .innerJoinAndSelect('account.roles', 'roles')
      .where(
        'account.phone = :phone and driver.activateStatus = :activateStatus',
        { phone, activateStatus: RegisterStatus.PENDING },
      )
      .getOne();
  }
}
