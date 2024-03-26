import { Injectable } from '@nestjs/common';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
import { Booking, BookingStatus } from '~entities/booking.entity';
import { FindAllDto } from '~/modules/booking/dto/find-all.dto';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }

  existNotCompletedByUserId(userId: number) {
    return this.existsBy({
      userId,
      status: Not(
        In([
          BookingStatus.COMPLETED,
          BookingStatus.CANCELLED,
          BookingStatus.REJECTED,
        ]),
      ),
    });
  }

  findRecentByUserId(userId: number) {
    return this.find({
      where: {
        userId,
        status: Raw((alias) => `${alias} not in (:...status)`, {
          status: [BookingStatus.REJECTED, BookingStatus.CANCELLED],
        }),
      },
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['locations', 'notes'],
    });
  }

  findRecentByIdAndUserId(bookingId: number, userId: number) {
    return this.findOne({
      where: { id: bookingId, userId, status: BookingStatus.PENDING },
    });
  }

  findAllByUserId(userId: number, findAllDto: FindAllDto) {
    return this.find({
      where: {
        userId,
        status: Not(In([BookingStatus.REJECTED, BookingStatus.CANCELLED])),
      },
      order: { [findAllDto.sort]: findAllDto.order },
      take: findAllDto.take,
      skip: findAllDto.skip,
    });
  }

  findAllByDriverId(driverId: number, findAllDto: FindAllDto) {
    return this.find({
      where: { driverId },
      order: { [findAllDto.sort]: findAllDto.order },
      take: findAllDto.take,
      skip: findAllDto.skip,
    });
  }

  findAll(findAllDto: FindAllDto) {
    return this.find({
      where: {
        status: Not(In([BookingStatus.REJECTED, BookingStatus.CANCELLED])),
      },
      order: {
        [findAllDto.sort]: findAllDto.order,
      },
      take: findAllDto.take,
      skip: findAllDto.skip,
    });
  }

  findOneByIdAndUserId(bookingId: number, userId: number) {
    return this.findOne({
      where: { id: bookingId, userId },
      relations: ['locations', 'notes', 'driver'],
    });
  }
}
