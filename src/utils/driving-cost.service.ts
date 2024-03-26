import { Injectable } from '@nestjs/common';

@Injectable()
export class DrivingCostService {
  private readonly STARTING_PRICE: number;
  private readonly PRICE_PER_KM_10: number;
  private readonly PRICE_PER_KM_10_20: number;
  private readonly PRICE_PER_KM_20: number;
  private readonly PRICE_PER_WAYPOINT: number;
  private readonly AFTER_21H_PRICE: number;
  private readonly AFTER_23H_PRICE: number;

  constructor() {
    this.STARTING_PRICE = parseInt(process.env.STARTING_PRICE!);
    this.PRICE_PER_KM_10 = parseInt(process.env.PRICE_PER_KM_10!);
    this.PRICE_PER_KM_10_20 = parseInt(process.env.PRICE_PER_KM_10_20!);
    this.PRICE_PER_KM_20 = parseInt(process.env.PRICE_PER_KM_20!);
    this.PRICE_PER_WAYPOINT = parseInt(process.env.PRICE_PER_WAYPOINT!);
    this.AFTER_21H_PRICE = parseInt(process.env.AFTER_21H_PRICE!);
    this.AFTER_23H_PRICE = parseInt(process.env.AFTER_23H_PRICE!);
  }

  calculate(distance: number, numberOfWaypoints: number = 2): number {
    const current = new Date();
    const isAfter21h: boolean = current.getHours() >= 21;
    const isAfter23h: boolean =
      current.getHours() === 23 || current.getHours() < 5;
    const priceLevel: number = Math.floor(distance / 10);
    let price: number = this.STARTING_PRICE;

    price +=
      priceLevel === 0
        ? (distance % 10) * this.PRICE_PER_KM_10
        : 10 * this.PRICE_PER_KM_10;

    if (priceLevel > 0) {
      price +=
        priceLevel === 1
          ? ((distance - 10) % 10) * this.PRICE_PER_KM_10_20
          : 10 * this.PRICE_PER_KM_10_20;
    }

    if (priceLevel > 1) {
      price += ((distance - 20) % 10) * this.PRICE_PER_KM_20;
    }

    price += numberOfWaypoints * this.PRICE_PER_WAYPOINT;

    if (isAfter21h) {
      if (isAfter23h) {
        price *= this.AFTER_23H_PRICE;
      } else {
        price *= this.AFTER_21H_PRICE;
      }
    }

    return price;
  }
}
