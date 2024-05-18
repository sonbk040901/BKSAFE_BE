import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverRepository } from '~repos/driver.repository';
import { DriverNotFoundException } from '~exceptions/httpException';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { DriverStatus } from '~entities/driver.entity';
import { BookingRepository } from '~repos/booking.repository';
import { DistanceService } from '~utils/distance.service';
import { Booking } from '~entities/booking.entity';

@Injectable()
export class DriverService {
  constructor(
    private distanceService: DistanceService,
    private driverRepository: DriverRepository,
    private bookingRepository: BookingRepository,
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
    return this.updateNextLocation(booking, location);
  }

  /**
   * Thay đổi trạng thái booking khi tài xế đến điểm đến
   * * Nếu chưa đến điểm cuối cùng thì cập nhật nextLocationId
   * (để driver có thể xác nhận hoàn thành chuyến đi nếu đã đến điểm cuối)
   * @param booking
   * @param location
   * @private
   */
  private updateNextLocation(
    booking: Booking,
    location: UpdateDriverLocationDto,
  ) {
    const locations = booking.locations;
    // Tìm điểm đến gần nhất với vị trí hiện tại của driver (r < 100m) -> để cập nhật nextLocationId
    const index = locations.findIndex((l) => {
      const distance = this.distanceService.calculate(l, location);
      return distance < 200;
    });
    if (index === -1 || index === 0) return booking;
    if (index !== locations.length - 1)
      booking.nextLocationId = locations[index + 1].id;
    return this.bookingRepository.save(booking);
  }

  async updateStatus(id: number, driverStatusDto: UpdateDriverStatusDto) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) throw new DriverNotFoundException();
    driver.status = DriverStatus[driverStatusDto.status];
    return await this.driverRepository.save(driver);
  }

  findAll() {
    return `This action returns all driver`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
