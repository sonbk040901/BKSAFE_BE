import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BookingSuggestDriver } from '~entities/booking-suggest-driver.entity';

@Injectable()
export class BookingSuggestDriverRepository extends Repository<BookingSuggestDriver> {
  constructor(dataSource: DataSource) {
    super(BookingSuggestDriver, dataSource.createEntityManager());
  }

  findOneByDriverId(driverId: number) {
    return this.findOne({
      where: { driverId },
      relations: ['booking', 'booking.locations', 'booking.notes'],
    });
  }
}
