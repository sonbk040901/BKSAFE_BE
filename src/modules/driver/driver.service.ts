import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { And, Raw } from 'typeorm';
import { ActionDriverDto } from '@driver/dto/action-driver.dto';
import { ActionRegisterDriverDto } from '@driver/dto/action-register-driver.dto';
import { PagingResponseDto } from '~/common/dto/paging-response.dto';
import { ActivateStatus } from '~entities/account.entity';
import { Booking, BookingStatus } from '~entities/booking.entity';
import { DriverStatus } from '~entities/driver.entity';
import { DriverNotFoundException } from '~exceptions/httpException';
import { BookingRepository } from '~repos/booking.repository';
import { DriverRepository } from '~repos/driver.repository';
import { MatchingStatisticRepository } from '~repos/matching-statistic.repository';
import { DistanceService } from '~utils/distance.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { daysInMonth } from '~utils/common';
import { GetDriverStatisticDto } from '@driver/dto/get-driver-statistic.dto';

@Injectable()
export class DriverService {
  constructor(
    private distanceService: DistanceService,
    private driverRepository: DriverRepository,
    private bookingRepository: BookingRepository,
    private statisticRepository: MatchingStatisticRepository,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save(driver);
  }

  async updateLocation(id: number, location: UpdateDriverLocationDto) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) throw new DriverNotFoundException();
    driver.location = location;
    await this.driverRepository.save(driver);
    // Lấy ra booking hiện tại của driver
    const booking = await this.bookingRepository.findCurrentByDriverId(id);
    if (!booking) return null;
    void this.updateNextLocation(booking, location);
    return booking;
  }

  /**
   * Thay đổi trạng thái booking khi tài xế đến điểm đến
   * * Nếu chưa đến điểm cuối cùng thì cập nhật nextLocationId
   * (để driver có thể xác nhận hoàn thành chuyến đi nếu đã đến điểm cuối)
   * @param booking
   * @param location
   * @private
   */
  private async updateNextLocation(
    booking: Booking,
    location: UpdateDriverLocationDto,
  ) {
    const locations = booking.locations;
    // Tìm điểm đến gần nhất với vị trí hiện tại của driver (r < 100m) -> để cập nhật nextLocationId
    const index = locations.findIndex((l) => {
      const distance = this.distanceService.calculate(l, location);
      return distance < 200;
    });
    if (index === -1 || index === 0) return null;
    if (index !== locations.length - 1)
      booking.nextLocationId = locations[index + 1].id;
    return this.bookingRepository.save(booking);
  }

  async updateStatus(id: number, driverStatusDto: UpdateDriverStatusDto) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) throw new DriverNotFoundException();
    driver.status = driverStatusDto.status;
    return await this.driverRepository.save(driver);
  }

  async findAll(findAllDto: FindAllDto) {
    const [drivers, count] = await this.driverRepository.findAll(findAllDto);
    return new PagingResponseDto(drivers, count, findAllDto);
  }

  async statistic() {
    const statusResult = await this.driverRepository.query<{
      total: string;
      status: DriverStatus;
    }>(
      "SELECT COUNT(*) as total, status FROM drivers d where d.register_status = 'ACCEPTED' GROUP BY status",
    );
    const activateStatusResult = await this.driverRepository.query<{
      total: number;
      activateStatus: ActivateStatus;
    }>(
      "SELECT COUNT(*) as total, activate_status activateStatus FROM drivers where register_status = 'ACCEPTED' GROUP BY activateStatus",
    );
    const status = statusResult.reduce(
      (acc, { total, status }) => {
        acc[status] = +total;
        return acc;
      },
      {
        OFFLINE: 0,
        BUSY: 0,
        AVAILABLE: 0,
      } as Record<DriverStatus, number>,
    );
    const activateStatus = activateStatusResult.reduce(
      (acc, { total, activateStatus }) => {
        acc[activateStatus] = +total;
        return acc;
      },
      { ACTIVATED: 0, BLOCKED: 0 } as Record<ActivateStatus, number>,
    );
    return {
      total: statusResult.reduce((acc, { total }) => +total + acc, 0),
      status,
      activateStatus,
    };
  }

  findOne(id: number) {
    return this.driverRepository.findOne({
      where: { id },
      relations: ['license', 'cccd', 'matchingStatistic'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }

  actionRegister(id: number, actionDriverDto: ActionRegisterDriverDto) {
    return this.driverRepository.update(
      { id },
      { registerStatus: actionDriverDto.status },
    );
  }

  action(id: number, actionDriverDto: ActionDriverDto) {
    return this.driverRepository.update(
      { id },
      { activateStatus: actionDriverDto.status },
    );
  }

  async findAllRegister(findAllDto: FindAllDto) {
    const [drivers, count] = await this.driverRepository.findAndCount({
      where: { activateStatus: ActivateStatus.ACTIVATED },
      order: { [findAllDto.sort]: findAllDto.order },
      take: findAllDto.take,
      skip: findAllDto.skip,
    });
    return new PagingResponseDto(drivers, count, findAllDto);
  }

  // async getStatisticByDriver(driverId: number, month: Date) {
  //   const results: { totalPrice: string; totalBooking: string }[] =
  //     await this.bookingRepository.query(
  //       'SELECT sum(price) totalPrice, count(*) totalBooking FROM bookings WHERE driver_id = ? and status = "COMPLETED" AND year(created_at) = year(?) AND month(created_at) = month(?) group by driver_id',
  //       [driverId, month, month],
  //     );
  //   const isCurrentMonth = isCurrent(month, 'month');
  //   const statistic = await this.statisticRepository.findOneBy({ driverId });
  //   return {
  //     totalBooking: +(results[0]?.totalBooking || 0),
  //     totalPrice: +(results[0]?.totalPrice || 0),
  //     totalReject: isCurrentMonth ? statistic?.reject || 0 : undefined,
  //   };
  // }

  async getStatisticByDriver(driverId: number, dto: GetDriverStatisticDto) {
    const yearQuery =
      "SELECT month(created_at) value, sum(price) price, count(*) total FROM bookings b where driver_id = ? and status = 'COMPLETED' and year(created_at) = year(?) group by value";
    const monthQuery =
      "SELECT day(created_at) value, sum(price) price, count(*) total FROM bookings WHERE driver_id = ? and status = 'COMPLETED' AND year(created_at) = year(?) AND month(created_at) = month(?) group by value";
    const result: { value: string; price: string; total: string }[] =
      await this.bookingRepository.query(
        dto.type === 'year' ? yearQuery : monthQuery,
        [driverId, dto.date, dto.date],
      );
    const length = dto.type === 'year' ? 12 : daysInMonth(dto.date);
    const statistic = Array.from({ length }, (_, i) => {
      const value = i + 1;
      const r = result.find((r) => +r.value == value);
      return {
        value,
        price: +(r?.price || 0),
        total: +(r?.total || 0),
      };
    });
    const bookings = await this.getBookings(driverId, dto);
    const matchingStatistic = await this.statisticRepository.findOneBy({
      driverId,
    });
    return { statistic, bookings, reject: matchingStatistic?.reject || 0 };
  }

  async getBookings(driverId: number, dto: GetDriverStatisticDto) {
    return await this.bookingRepository.find({
      where: {
        driverId,
        createdAt:
          dto.type === 'month'
            ? And(
                Raw((alias) => `MONTH(${alias}) = MONTH(:month)`, {
                  month: dto.date,
                }),
                Raw((alias) => `YEAR(${alias}) = YEAR(:year)`, {
                  year: dto.date,
                }),
              )
            : Raw((alias) => `YEAR(${alias}) = YEAR(:year)`, {
                year: dto.date,
              }),
        status: BookingStatus.COMPLETED,
      },
      relations: ['user', 'locations'],
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  private async autoClearStatistic() {
    await this.statisticRepository.update(
      {},
      { reject: 0, accept: 0, fail: 0, success: 0, total: 0 },
    );
    console.log('Clear statistic every month');
  }
}
