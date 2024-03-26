import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DrivingCostService } from '~utils/driving-cost.service';
import { BookingRepository } from '~repos/booking.repository';
import { BookingStatus } from '~entities/booking.entity';
import {
  BookingNotFoundException,
  NotCompletedBookingAlreadyExistsException,
} from '~exceptions/httpException';
import { FindAllDto } from './dto/find-all.dto';
import { Account } from '~entities/account.entity';
import { ChangeFindDriverModeDto } from './dto/change-find-driver-mode.dto';
import { LocationType } from '~entities/location.entity';

@Injectable()
export class BookingService {
  private autoFindDriver: boolean = true;

  constructor(
    private bookingRepository: BookingRepository,
    private drivingCostService: DrivingCostService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const isExistNotCompleted =
      await this.bookingRepository.existNotCompletedByUserId(userId);
    if (isExistNotCompleted)
      throw new NotCompletedBookingAlreadyExistsException();

    const { distance, pickup, dropOff, stops, note, notes } = createBookingDto;
    const price = this.drivingCostService.calculate(distance, stops.length + 2);

    const pickupLocation = { ...pickup, type: LocationType.PICKUP };
    const dropOffLocation = { ...dropOff, type: LocationType.DROP_OFF };
    const stopsLocations = stops.map((stop) => ({
      ...stop,
      type: LocationType.STOP,
    }));
    const locations = [pickupLocation, dropOffLocation, ...stopsLocations];
    //todo: kiểm tra nếu là chế độ tìm tài xế tự động thì gọi hàm tìm tài xế
    const booking = this.bookingRepository.create({
      price,
      locations,
      userId,
      note,
      notes: notes.map((noteId) => ({ id: noteId })),
    });
    return this.bookingRepository.save(booking);
  }

  findAll(findAllDto: FindAllDto) {
    return this.bookingRepository.findAll(findAllDto);
  }

  userFindAll(account: Account, findAllDto: FindAllDto) {
    return this.bookingRepository.findAllByUserId(account.id, findAllDto);
  }

  driverFindAll(account: Account, findAllDto: FindAllDto) {
    return this.bookingRepository.findAllByDriverId(account.id, findAllDto);
  }

  async getRecent(userId: number) {
    const results = await this.bookingRepository.findRecentByUserId(userId);
    if (!results.length) return null;
    const recentBookingIsCompleted =
      results[0].status === BookingStatus.COMPLETED;
    const current = recentBookingIsCompleted ? null : results[0];
    const recent = recentBookingIsCompleted ? results[0] : results[1] ?? null;

    return { current, recent };
  }

  async cancel(userId: number, bookingId: number) {
    const booking = await this.bookingRepository.findRecentByIdAndUserId(
      bookingId,
      userId,
    );
    if (!booking) throw new BookingNotFoundException();
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  changeFindDriverMode(changeModeDto: ChangeFindDriverModeDto) {
    let mode: boolean;
    if (changeModeDto.auto === undefined) mode = !this.autoFindDriver;
    else mode = changeModeDto.auto;
    this.autoFindDriver = mode;
    return this.autoFindDriver;
  }

  acceptBooking(account: Account, id: number) {}

  rejectBooking(account: Account, id: number) {}

  suggestDriver(bookingId: number, driverId: number) {}

  getSuggestDrivers(bookingId: number) {}

  reject(bookingId: number) {}

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
}