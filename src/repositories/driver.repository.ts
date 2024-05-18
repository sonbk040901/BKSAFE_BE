import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FindAllDto } from '~/modules/driver/dto/find-all.dto';
import { Driver, DriverStatus } from '~entities/driver.entity';

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

  async findDrivers() {
    return null;
    // return this.createQueryBuilder('d')
    //   .innerJoinAndSelect('d.account', 'a', 'a.id = d.account_id')
    //   .where('d.status = :status', { status: '0' })
    //   .select([
    //     'd.id id',
    //     'd.created_at createdAt',
    //     'd.updated_at updatedAt',
    //     'birthday',
    //     'address',
    //     'rating',
    //     'location_longitude',
    //     'location_latitude',
    //     'location_address',
    //     'email',
    //     'status',
    //     // 'd.location location',
    //     'rating rating',
    //     'username username',
    //     'full_name fullName',
    //     'avatar',
    //     'gender',
    //   ])
    //   .getRawMany()
    //   .then((drivers) =>
    //     drivers.map((driver) => {
    //       driver.location = {
    //         longitude: driver.location_longitude,
    //         latitude: driver.location_latitude,
    //         address: driver.location_address,
    //       };
    //       delete driver.location_longitude;
    //       delete driver.location_latitude;
    //       delete driver.location_address;
    //       return driver;
    //     }),
    //   );
  }

  async findOneByEmail(email: string) {
    return this.createQueryBuilder('driver')
      .innerJoinAndSelect('driver.account', 'account')
      .innerJoinAndSelect('account.roles', 'roles')
      .where('account.email = :email', { email })
      .getOne();
  }
}
