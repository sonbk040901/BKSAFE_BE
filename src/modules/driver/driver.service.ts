import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverRepository } from '~repos/driver.repository';
import { DriverNotFoundException } from '~exceptions/httpException';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { DriverStatus } from '~entities/driver.entity';
import { BookingRepository } from '~repos/booking.repository';

@Injectable()
export class DriverService {
  constructor(
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

  findCurrentByDriverId(id: number) {
    return this.bookingRepository.findCurrentByDriverId(id);
  }
}
