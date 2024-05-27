import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FindAllDto } from '~/modules/driver/dto/find-all.dto';
import { ActivateStatus, Driver } from '~entities/driver.entity';

@Injectable()
export class DriverRepository extends Repository<Driver> {
  constructor(dataSource: DataSource) {
    super(
      Driver,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  findAll(findAllDto: FindAllDto, relations?: string[]) {
    return this.findAndCount({
      where: {},
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
        // status: DriverStatus.AVAILABLE,
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
        { phone, activateStatus: ActivateStatus.ACTIVATED },
      )
      .getOne();
  }

  async findOneByPhone(phone: string) {
    return this.createQueryBuilder('driver')
      .innerJoinAndSelect('driver.account', 'account')
      .leftJoinAndSelect('account.roles', 'roles')
      .leftJoinAndSelect('driver.matchingStatistic', 'matchingStatistic')
      .where('account.phone = :phone', { phone })
      .getOne();
  }
}
