import { ActionDriverDto } from '@driver/dto/action-driver.dto';
import { ActionRegisterDriverDto } from '@driver/dto/action-register-driver.dto';
import { Injectable } from '@nestjs/common';
import { PagingResponseDto } from '~/common/dto/paging-response.dto';
import { ActivateStatus } from '~entities/account.entity';
import { Booking } from '~entities/booking.entity';
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
import { UpdateDriverDto } from './dto/update-driver.dto';

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
    this.updateNextLocation(booking, location);
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
      'SELECT COUNT(*) as total, status FROM drivers d where d.register_status = "ACCEPTED" GROUP BY status',
    );
    const activateStatusResult = await this.driverRepository.query<{
      total: number;
      activateStatus: ActivateStatus;
    }>(
      'SELECT COUNT(*) as total, activate_status activateStatus FROM drivers where register_status = "ACCEPTED" GROUP BY activateStatus',
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

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
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
}
