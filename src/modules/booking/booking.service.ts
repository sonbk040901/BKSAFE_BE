import { FindSuggestDriverDto } from '@booking/dto/find-suggest-driver.dto';
import { Injectable } from '@nestjs/common';
import { PagingResponseDto } from '~dto/paging-response.dto';
import { Account } from '~entities/account.entity';
import { BookingStatus } from '~entities/booking.entity';
import { Driver, DriverStatus } from '~entities/driver.entity';
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
import { BookingGateway } from './booking.gateway';
import { genFindOperator } from '~/repositories/utils';
import { ignoreExceptions } from '~/utils/common';
import { PriorityService } from '~/utils/priority.service';

@Injectable()
export class BookingService {
  private autoFindDriver: boolean = false;
  /**
   * Timeout duration (in milliseconds) for finding a driver.
   * If the driver is not found within this duration, the booking will be cancelled.
   * Default: 5 minutes
   */
  private readonly FIND_DRIVER_TIMEOUT = 5 * 60 * 1000;
  private readonly SUGGEST_TIMEOUT = 21_000;
  private readonly FIND_DRIVER_INTERVAL = 1_000;
  private readonly MAX_SUGGEST_DRIVER = 5;
  private readonly MAX_SUGGEST_DRIVER_RADIUS = 2500;

  constructor(
    private drivingCostService: DrivingCostService,
    private driverPriorityService: DriverPriorityService,
    private priorityService: PriorityService,
    private distanceService: DistanceService,
    private bookingRepository: BookingRepository,
    private noteRepository: NoteRepository,
    private bSDRepository: BookingSuggestDriverRepository,
    private driverRepository: DriverRepository,
    private statisticRepository: MatchingStatisticRepository,
    private bookingGateway: BookingGateway,
  ) {
    this.updateSettings();
  }

  private async updateSettings() {
    const results = await this.driverRepository.query<{
      name: string;
      value: string;
    }>('SELECT name, value FROM settings WHERE name in (?,?,?,?)', [
      'auto_find_driver',
      'find_driver_timeout',
      'suggest_timeout',
      'find_driver_interval',
    ]);
    this.autoFindDriver =
      results.find((r) => r.name === 'auto_find_driver')?.value === '1';
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
    //Cứ mỗi 1 giây tìm 1 lần tài xế
    const ti = setInterval(() => {
      this.autoSuggestDriver(pickup, booking.id);
    }, this.FIND_DRIVER_INTERVAL);
    //Sau 5 phút không tìm được tài xế thì chuyển trạng thái booking sang timeout
    setTimeout(() => {
      clearInterval(ti);
      ignoreExceptions(this.timeout.bind(this), booking.id);
    }, this.FIND_DRIVER_TIMEOUT);
    return booking;
  }

  async timeout(bookingId: number) {
    const whereQuery = {
      id: bookingId,
      status: genFindOperator([BookingStatus.PENDING, BookingStatus.ACCEPTED]),
    };
    const booking = await this.bookingRepository.findOneBy(whereQuery);
    if (!booking) throw new BookingNotFoundException();
    await this.bSDRepository.delete({ bookingId });
    booking.status = BookingStatus.TIMEOUT;
    await this.bookingRepository.save(booking, { reload: false });
    this.bookingGateway.updateBookingStatus(
      booking.userId,
      BookingStatus.TIMEOUT,
    );
    return booking.userId;
  }

  private async autoSuggestDriver(pickup: LocationDto, bookingId: number) {
    const suggestDrivers = await this.getSuggestDriversByLocationV2(
      pickup,
      bookingId,
    );
    if (!suggestDrivers.length) {
      await this.bSDRepository.delete({ bookingId });
      return;
    }
    const driver = suggestDrivers[0];
    await this.suggestDriver(bookingId, driver.id);
    this.bookingGateway.suggestDriver(driver.id, bookingId);
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
      [BookingStatus.PENDING, BookingStatus.ACCEPTED],
    );
    if (!booking) throw new BookingNotFoundException();
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  changeFindDriverMode(changeModeDto: ChangeFindDriverModeDto) {
    this.autoFindDriver = changeModeDto.auto ?? !this.autoFindDriver;
    this.driverRepository.query(
      'REPLACE INTO settings (name,value) VALUES (?, ?)',
      ['auto_find_driver', this.autoFindDriver ? '1' : '0'],
    );
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
    await this.driverRepository.update(
      { id: account.id },
      { status: DriverStatus.BUSY },
    );
    return this.bookingRepository.save(booking);
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
  }

  async suggestDriver(bookingId: number, driverId: number) {
    const booking = await this.bookingRepository.findOneByOrFail({
      id: bookingId,
      status: genFindOperator([BookingStatus.PENDING, BookingStatus.ACCEPTED]),
    });
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
    setTimeout(
      () =>
        ignoreExceptions(this.rejectBooking.bind(this), driverId, booking.id),
      this.SUGGEST_TIMEOUT,
    );
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
    const suggestDrivers = await this.getSuggestDriversByLocationV2(
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
    bookingId: number,
  ) {
    // Tìm ra tài xế chưa từng được đề xuất cho booking này và đang không được đề xuất cho booking khác
    const results = await this.driverRepository
      .createQueryBuilder('d')
      .where(
        'd.id not in (select driver_id from booking_suggest_drivers where booking_id = :id or is_rejected = 0)',
        { id: bookingId },
      )
      .leftJoinAndSelect('d.matchingStatistic', 'matchingStatistic')
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

  private async getSuggestDriversByLocationV2(
    pickup: ILocation,
    bookingId: number,
    radius: number = this.MAX_SUGGEST_DRIVER_RADIUS,
  ) {
    // Tìm ra tài xế chưa từng được đề xuất cho booking này và đang không được đề xuất cho booking khác
    const results = await this.driverRepository
      .createQueryBuilder('d')
      .where(
        'd.id not in (select driver_id from booking_suggest_drivers where booking_id = :id or is_rejected = 0)',
        { id: bookingId },
      )
      .andWhere('d.status = :status', { status: DriverStatus.AVAILABLE })
      .leftJoinAndSelect('d.matchingStatistic', 'matchingStatistic')
      .getMany();
    console.log(results.length);
    const suggestDrivers: Driver[] = results.filter((driver) => {
      const distance = this.distanceService.calculate(pickup, driver.location);
      driver['distance'] = distance;
      return distance <= radius;
    });
    const variance = this.priorityService.calculateVariance(
      suggestDrivers.map((d) => d.matchingStatistic?.accept ?? 0),
    );
    const drivers = suggestDrivers.map((driver) => {
      const normalDistribution =
        this.priorityService.calculateNormalDistribution(
          driver.matchingStatistic?.accept ?? 0,
          variance,
        );
      Object.assign(driver, { normalDistribution });
      return driver as Driver & {
        normalDistribution: number;
      };
    });
    const maxNormalDistribution = Math.max(
      ...drivers.map((d) => d.normalDistribution),
    );
    return drivers
      .map((driver) => {
        const distance = driver['distance'] as number;
        const matchingStatistic = driver.matchingStatistic;
        const normalDistribution = driver.normalDistribution;
        const options = {
          distance,
          rating: driver.rating,
          matchCount: matchingStatistic?.total ?? 0,
          rejectCount: matchingStatistic?.reject ?? 0,
          acceptCount: matchingStatistic?.accept ?? 0,
          normalDistribution,
          maxNormalDistribution,
        };
        driver['priority'] = this.priorityService.calculate(options);
        Object.assign(driver, options);
        return driver;
      })
      .sort((d1, d2) => d2['priority'] - d1['priority']);
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

  async completeBooking(driver: Driver, id: number) {
    const booking =
      await this.bookingRepository.findOneByIdAndDriverIdAndStatus(
        id,
        driver.id,
        BookingStatus.DRIVING,
        ['locations'],
      );
    if (!booking) throw new BookingNotFoundException();
    const distance = this.distanceService.calculate(
      driver.location,
      booking.dropOffLocation,
    );
    if (distance > 200) throw new DistanceTooFarException();
    booking.status = BookingStatus.COMPLETED;
    await this.updateMatchingStatistic(driver.id, [
      { increase: true, field: 'success' },
    ]);
    await this.driverRepository.update(
      { id: driver.id },
      { status: DriverStatus.AVAILABLE },
    );
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
    return result.reduce(
      (acc, { status, count }) => {
        acc[status] = +count;
        return acc;
      },
      {
        PENDING: 0,
        ACCEPTED: 0,
        RECEIVED: 0,
        DRIVING: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        REJECTED: 0,
        TIMEOUT: 0,
      },
    );
  }

  async rate(userId: number, ratingDto: RatingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id: ratingDto.bookingId, userId, rating: IsNull() },
    });
    if (!booking) throw new BookingNotFoundException();
    booking.rating = ratingDto.rating;
    booking.review = ratingDto.review;
    await this.bookingRepository.save(booking);
    this.driverRepository.query(
      'UPDATE drivers SET rating = (SELECT AVG(rating) FROM bookings WHERE driver_id = drivers.id) WHERE id = ?',
      [booking.driverId],
    );
  }
}
