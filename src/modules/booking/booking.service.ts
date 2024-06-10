import { FindSuggestDriverDto } from '@booking/dto/find-suggest-driver.dto';
import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { PagingResponseDto } from '~dto/paging-response.dto';
import { Account } from '~entities/account.entity';
import { Booking, BookingStatus } from '~entities/booking.entity';
import { Driver } from '~entities/driver.entity';
import { LocationType } from '~entities/location.entity';
import { MatchingStatistic } from '~entities/matching-statistic.entity';
import {
  BookingNotFoundException,
  DistanceTooFarException,
  NotCompletedBookingAlreadyExistsException,
} from '~exceptions/httpException';
import { ILocation } from '~interfaces/location.interface';
import { BookingSuggestDriverRepository } from '~repos/booking-suggest-driver.repository';
import { BookingRepository } from '~repos/booking.repository';
import { DriverRepository } from '~repos/driver.repository';
import { MatchingStatisticRepository } from '~repos/matching-statistic.repository';
import { NoteRepository } from '~repos/note.repository';
import { DistanceService } from '~utils/distance.service';
import { DriverPriorityService } from '~utils/driver-priority.service';
import { DrivingCostService } from '~utils/driving-cost.service';
import { ChangeFindDriverModeDto } from './dto/change-find-driver-mode.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindAllDto } from './dto/find-all.dto';
import { RatingDto } from '@booking/dto/rating.dto';
import { IsNull } from 'typeorm';
import { LocationDto } from '@booking/dto/location.dto';

@Injectable()
export class BookingService {
  private autoFindDriver: boolean = false;

  constructor(
    private drivingCostService: DrivingCostService,
    private driverPriorityService: DriverPriorityService,
    private distanceService: DistanceService,
    private bookingRepository: BookingRepository,
    private noteRepository: NoteRepository,
    private bSDRepository: BookingSuggestDriverRepository,
    private driverRepository: DriverRepository,
    private statisticRepository: MatchingStatisticRepository,
  ) {}

  public getAutoFindDriver() {
    return this.autoFindDriver;
  }

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const isExistNotCompleted =
      await this.bookingRepository.existNotCompletedByUserId(userId);
    if (isExistNotCompleted)
      throw new NotCompletedBookingAlreadyExistsException();

    const { distance, pickup, dropOff, stops, note } = createBookingDto;
    const price = this.drivingCostService.calculate(distance, stops.length + 2);

    const pickupLocation = { ...pickup, type: LocationType.PICKUP };
    const dropOffLocation = { ...dropOff, type: LocationType.DROP_OFF };
    const stopsLocations = stops.map((stop) => ({
      ...stop,
      type: LocationType.STOP,
    }));
    const locations = [pickupLocation, ...stopsLocations, dropOffLocation];
    const notes = await this.noteRepository.findById(createBookingDto.notes);
    const booking = this.bookingRepository.create({
      price,
      locations,
      userId,
      note,
      notes,
    });
    await this.bookingRepository.save(booking);
    if (!this.autoFindDriver) return booking;
    await this.autoSuggestDriver(pickup, booking.id);
    return booking;
  }

  private async autoSuggestDriver(pickup: LocationDto, bookingId: number) {
    const suggestDrivers = await this.getSuggestDriversByLocation(pickup);
    if (!suggestDrivers.length) return;
    const driver = suggestDrivers[0];
    await this.suggestDriver(bookingId, driver.id);
  }

  async findAll(findAllDto: FindAllDto) {
    const [bookings, count] = await this.bookingRepository.findAll(findAllDto, [
      'locations',
      'user',
      'driver',
    ]);
    return new PagingResponseDto(bookings, count, findAllDto);
  }

  async userFindAll(account: Account, findAllDto: FindAllDto) {
    const [bookings, count] = await this.bookingRepository.findAllByUserId(
      account.id,
      findAllDto,
    );
    return new PagingResponseDto(bookings, count, findAllDto);
  }

  async driverFindAll(account: Account, findAllDto: FindAllDto) {
    const [bookings, count] = await this.bookingRepository.findAllByDriverId(
      account.id,
      findAllDto,
    );
    return new PagingResponseDto(bookings, count, findAllDto);
  }

  async getRecent(userId: number) {
    const results = await this.bookingRepository.findRecentByUserId(userId);
    if (!results.length)
      return {
        current: null,
        recent: null,
      };

    const recentBookingIsCompleted =
      results[0].status === BookingStatus.COMPLETED;
    const current = recentBookingIsCompleted ? null : results[0];
    const recent = recentBookingIsCompleted ? results[0] : results[1] ?? null;
    return { current, recent };
  }

  async cancel(userId: number, id: number) {
    const booking = await this.bookingRepository.findOneByIdAndUserIdAndStatus(
      id,
      userId,
      [BookingStatus.PENDING],
    );
    if (!booking) throw new BookingNotFoundException();
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  changeFindDriverMode(changeModeDto: ChangeFindDriverModeDto) {
    this.autoFindDriver = changeModeDto.auto ?? !this.autoFindDriver;
    return this.autoFindDriver;
  }

  async acceptBooking(account: Account, id: number) {
    const bsd = await this.bSDRepository.findOne({
      where: { bookingId: id, driverId: account.id, isRejected: false },
      relations: ['booking', 'booking.locations'],
    });
    if (!bsd) throw new BookingNotFoundException();
    const booking = bsd.booking;
    await this.bSDRepository.delete({ bookingId: id });
    booking.status = BookingStatus.RECEIVED;
    booking.driverId = account.id;
    booking.nextLocationId = bsd.booking.pickupLocation.id;
    await this.updateMatchingStatistic(account.id, [
      { increase: true, field: 'accept' },
    ]);
    const driver = await this.driverRepository.findOneOrFail({
      where: { id: account.id },
    });
    return [
      await this.bookingRepository.save(booking),
      Object.assign(driver, instanceToPlain(account)),
    ] as const;
  }

  async rejectBooking(driverId: number, bookingId: number) {
    const result = await this.bSDRepository.update(
      { bookingId, driverId, isRejected: false },
      { isRejected: true },
    );
    if (!result.affected) throw new BookingNotFoundException();
    await this.updateMatchingStatistic(driverId, [
      { increase: true, field: 'reject' },
    ]);
    if (this.autoFindDriver) {
      const bsds = await this.bSDRepository.findBy({
        bookingId,
      });
      if (bsds.length && bsds.every((bsd) => bsd.isRejected)) {
        const booking = await this.bookingRepository.findOneByOrFail({
          id: bookingId,
        });
        await this.autoSuggestDriver(booking.pickupLocation, bookingId);
      }
    }
  }

  async suggestDriver(bookingIdOrBooking: number | Booking, driverId: number) {
    const booking =
      typeof bookingIdOrBooking === 'number'
        ? await this.bookingRepository.findOneByOrFail({
            id: bookingIdOrBooking,
          })
        : bookingIdOrBooking;
    await this.bSDRepository.insert({
      bookingId: booking.id,
      driverId,
    });
    await this.bookingRepository.update(
      { id: booking.id },
      { status: BookingStatus.ACCEPTED },
    );
    await this.updateMatchingStatistic(driverId, [
      { increase: true, field: 'total' },
    ]);
    setTimeout(() => this.rejectBooking(driverId, booking.id).catch(), 21_000);
    return booking;
  }

  async getSuggestDrivers(
    bookingId: number,
    suggestDriverDto: FindSuggestDriverDto,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['locations'],
    });
    if (!booking) throw new BookingNotFoundException();
    const pickup = booking.pickupLocation;
    const suggestDrivers = await this.getSuggestDriversByLocation(
      pickup,
      bookingId,
    );
    const data = suggestDrivers.slice(
      suggestDriverDto.skip,
      suggestDriverDto.skip + suggestDriverDto.take,
    );
    return new PagingResponseDto(data, suggestDrivers.length, suggestDriverDto);
  }

  private async getSuggestDriversByLocation(
    pickup: ILocation,
    bookingId?: number,
  ) {
    const results = await this.driverRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect(
        'd.bookingSuggestDriver',
        'bsd',
        'bsd.bookingId = :id and bsd.driverId = d.id and bsd.is_rejected = false',
        { id: bookingId },
      )
      .leftJoinAndSelect('d.matchingStatistic', 'matchingStatistic')
      .innerJoinAndSelect('d.account', 'account')
      .getMany();

    const suggestDrivers: Driver[] = [];
    results.forEach((driver) => {
      const distance = this.distanceService.calculate(pickup, driver.location);
      if (distance > 2500) return;
      const matchingStatistic = driver.matchingStatistic;
      const options = {
        distance,
        rating: driver.rating,
        matchCount: matchingStatistic?.total ?? 0,
        rejectCount: matchingStatistic?.reject ?? 0,
        successCount: matchingStatistic?.success ?? 0,
        acceptCount: matchingStatistic?.accept ?? 0,
      };
      driver['priority'] = this.driverPriorityService.calculate(options);
      Object.assign(driver, options);
      suggestDrivers.push(driver);
    });
    return suggestDrivers.sort((d1, d2) => d2['priority'] - d1['priority']);
  }

  async reject(bookingId: number) {
    const booking = await this.bookingRepository.findOneBy({
      id: bookingId,
      status: BookingStatus.PENDING,
    });
    if (!booking) throw new BookingNotFoundException();
    booking.status = BookingStatus.REJECTED;
    await this.bookingRepository.save(booking);
    return booking.userId;
  }

  getFindDriverMode() {
    return this.autoFindDriver;
  }

  async findOne(bookingId: number, userId: number) {
    const booking = await this.bookingRepository.findOneByIdAndUserId(
      bookingId,
      userId,
    );
    if (!booking) throw new BookingNotFoundException();
    return booking;
  }

  async findOneReceive(account: Account, id: number) {
    const bsd = await this.bSDRepository.findOne({
      where: { bookingId: id, driverId: account.id },
      relations: ['booking', 'booking.locations'],
    });
    if (!bsd) throw new BookingNotFoundException();
    return bsd.booking;
  }

  async completeBooking(account: Account, id: number) {
    const booking =
      await this.bookingRepository.findOneByIdAndDriverIdAndStatus(
        id,
        account.id,
        BookingStatus.DRIVING,
        ['locations'],
      );
    if (!booking) throw new BookingNotFoundException();
    const driver = await this.driverRepository.findOneOrFail({
      where: { id: account.id },
    });
    const distance = this.distanceService.calculate(
      driver.location,
      booking.dropOffLocation,
    );
    if (distance > 200) throw new DistanceTooFarException();
    booking.status = BookingStatus.COMPLETED;
    await this.updateMatchingStatistic(account.id, [
      { increase: true, field: 'success' },
    ]);
    return this.bookingRepository.save(booking);
  }

  async driverFindOneReceive(account: Account) {
    const bsd = await this.bSDRepository.findOneByDriverId(account.id);
    if (!bsd) throw new BookingNotFoundException();
    return bsd.booking;
  }

  async driverFindCurrent(account: Account) {
    const booking = await this.bookingRepository.findCurrentByDriverId(
      account.id,
    );
    if (!booking) throw new BookingNotFoundException();
    return booking;
  }

  driverFindOne(account: Account, id: number) {
    return this.bookingRepository.findOneByIdAndDriverId(id, account.id);
  }

  async startBooking(account: Account, id: number) {
    const booking =
      await this.bookingRepository.findOneByIdAndDriverIdAndStatus(
        id,
        account.id,
        BookingStatus.RECEIVED,
        ['locations'],
      );
    if (!booking) throw new BookingNotFoundException();
    booking.status = BookingStatus.DRIVING;
    booking.nextLocationId = booking.locations[1].id;
    return this.bookingRepository.save(booking);
  }

  private async updateMatchingStatistic(
    driverId: number,
    actions: {
      increase?: boolean;
      field: Exclude<keyof MatchingStatistic, 'driver' | 'id'>;
    }[],
  ) {
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['matchingStatistic'],
    });
    if (!driver) return;
    const statistic =
      driver.matchingStatistic ?? this.statisticRepository.create();
    actions.forEach((action) => {
      if (action.increase)
        statistic[action.field] = (statistic[action.field] ?? 0) + 1;
      else statistic[action.field] = (statistic[action.field] ?? 1) - 1;
    });
    driver.matchingStatistic = statistic;
    await this.driverRepository.save(driver);
  }

  async getStatistic() {
    const result: { status: string; count: string }[] =
      await this.bookingRepository.query(
        'select status, count(status) count from bookings group by status',
      );
    return result.reduce((acc, { status, count }) => {
      acc[status] = +count;
      return acc;
    }, {});
  }

  async rate(userId: number, ratingDto: RatingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id: ratingDto.bookingId, userId, rating: IsNull() },
    });
    if (!booking) throw new BookingNotFoundException();
    booking.rating = ratingDto.rating;
    booking.review = ratingDto.review;
    return this.bookingRepository.save(booking);
  }
}
