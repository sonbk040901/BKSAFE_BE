import { Injectable } from '@nestjs/common';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { FindDriversDto } from './dto/find-drivers.dto';
import { DriverRepository } from '~repos/driver.repository';
import { DrivingCostService } from '~utils/driving-cost.service';
import { DistanceService } from '~utils/distance.service';

@Injectable()
export class MapService {
  constructor(
    private driverRepository: DriverRepository,
    private drivingCostService: DrivingCostService,
    private distanceService: DistanceService,
  ) {}

  calculateDrivingCost(calculateCostDto: CalculateCostDto) {
    return this.drivingCostService.calculate(
      calculateCostDto.distance,
      calculateCostDto.numberOfWaypoints || calculateCostDto.positions?.length,
    );
  }

  async findDrivers(findDriversDto: FindDriversDto) {
    const results = await this.driverRepository.findAllAvailableDrivers();
    return results
      .filter((driver) => {
        const distance = this.distanceService.calculate(
          findDriversDto,
          driver.location,
        );
        driver.location['distance'] = distance;
        return distance <= findDriversDto.radius;
      })
      .map((driver) => driver.location);
  }
}
