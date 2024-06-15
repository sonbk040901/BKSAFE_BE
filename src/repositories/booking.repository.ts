import { Injectable } from '@nestjs/common';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
import { Booking, BookingStatus } from '~entities/booking.entity';
import { FindAllDto } from '~/modules/booking/dto/find-all.dto';
import { genFindOperator } from '~repos/utils';

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
      relations: ['locations', 'notes', 'driver'],
    });
  }

  findOneByIdAndUserIdAndStatus(
    id: number,
    userId: number,
    status: BookingStatus | BookingStatus[],
    relations?: string[],
  ) {
    return this.findOne({
      where: {
        id,
        userId,
        status: genFindOperator(status),
      },
      relations,
    });
  }

  findAllByUserId(userId: number, findAllDto: FindAllDto) {
    const status = findAllDto.status;
    return this.findAndCount({
      where: {
        userId,
        status: typeof status === 'object' ? In(status) : status,
      },
      order: { [findAllDto.sort]: findAllDto.order },
      take: findAllDto.take,
      skip: findAllDto.skip,
      relations: ['locations', 'notes', 'driver'],
    });
  }

  findAllByDriverId(driverId: number, findAllDto: FindAllDto) {
    const status = findAllDto.status;
    return this.findAndCount({
      where: {
        driverId,
        status: typeof status === 'object' ? In(status) : status,
      },
      order: { [findAllDto.sort]: findAllDto.order },
      take: findAllDto.take,
      skip: findAllDto.skip,
    });
  }

  findAll(findAllDto: FindAllDto, relations?: string[]) {
    const status = findAllDto.status;
    return this.findAndCount({
      where: {
        status: genFindOperator(status),
      },
      order: {
        [findAllDto.sort]: findAllDto.order,
      },
      take: findAllDto.take,
      skip: findAllDto.skip,
      relations,
    });
  }

  findOneByIdAndUserId(bookingId: number, userId: number) {
    return this.findOne({
      where: { id: bookingId, userId },
      relations: ['locations', 'notes', 'driver'],
    });
  }

  findCurrentByDriverId(driverId: number) {
    return this.findOne({
      where: {
        driverId,
        status: In([BookingStatus.RECEIVED, BookingStatus.DRIVING]),
      },
      relations: ['locations', 'notes', 'user'],
    });
  }

  findOneByIdAndDriverId(id: number, driverId: number, relations?: string[]) {
    return this.findOne({
      where: {
        id,
        driverId,
      },
      relations,
    });
  }

  findOneByDriverIdAndStatus(
    driverId: number,
    status: BookingStatus | BookingStatus[],
    relations?: string[],
  ) {
    return this.findOne({
      where: {
        driverId,
        status: genFindOperator(status),
      },
      relations,
    });
  }

  findOneByIdAndDriverIdAndStatus(
    id: number,
    driverId: number,
    status: BookingStatus | BookingStatus[],
    relations?: string[],
  ) {
    return this.findOne({
      where: {
        id,
        driverId,
        status: genFindOperator(status),
      },
      relations,
    });
  }
}
