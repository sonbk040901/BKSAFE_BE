import { Injectable } from '@nestjs/common';
import { ILocation } from '~interfaces/location.interface';

@Injectable()
export class DistanceService {
  private readonly EARTH_R = 6371e3;

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  private deltaRad(value1: number, value2: number) {
    return this.toRad(value2 - value1);
  }

  /**
   * Tính khoảng cách giữa 2 điểm trên bản đồ theo công thức haversine (mét)
   * @copyright (https://en.wikipedia.org/wiki/Haversine_formula)
   */
  calculate(origin: ILocation, destination: ILocation) {
    /* Bán kính trái đất, theo đơn vị mét*/
    /* Vĩ độ của điểm đầu và điểm cuối, chuyển đổi sang radian */
    const lat1 = this.toRad(origin.latitude); // φ, λ in radians
    const lat2 = this.toRad(destination.latitude);
    /* Độ chênh lệch giữa vĩ độ, kinh độ của điểm đầu và điểm cuối, chuyển đổi sang radian */
    const deltaLat = this.deltaRad(origin.latitude, destination.latitude);
    const deltaLng = this.deltaRad(origin.longitude, destination.longitude);
    const a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLng / 2), 2);
    // Góc giữa 2 điểm
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_R * c; // in metres
  }
}
