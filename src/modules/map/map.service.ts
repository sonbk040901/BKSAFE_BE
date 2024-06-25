import { Injectable } from '@nestjs/common';
import { DriverRepository } from '~repos/driver.repository';
import { DistanceService } from '~utils/distance.service';
import { DrivingCostService } from '~utils/driving-cost.service';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { FindDriversDto } from './dto/find-drivers.dto';

@Injectable()
export class MapService {
  private apiKey: string;
  constructor(
    private driverRepository: DriverRepository,
    private drivingCostService: DrivingCostService,
    private distanceService: DistanceService,
  ) {
    this.updateSettings();
  }

  private updateSettings() {
    this.driverRepository
      .query<{
        value: string;
      }>("SELECT value FROM settings WHERE name = 'google_maps_api_key'")
      .then((result) => {
        this.apiKey = result[0]?.value ?? '';
      });
  }

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
        driver.location['id'] = driver.id;
        return distance <= findDriversDto.radius;
      })
      .map((driver) => driver.location);
  }

  getApiKey() {
    return this.apiKey;
  }

  updateApiKey(key: string) {
    this.apiKey = key;
    this.driverRepository.query(
      "REPLACE INTO settings(name,value) VALUES ('google_maps_api_key', ?)",
      [key],
    );
  }
}
