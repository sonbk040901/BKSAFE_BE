import { Injectable } from '@nestjs/common';
import { IPriorityOptions } from '~utils/interfaces';

@Injectable()
export class DriverPriorityService {
  calculate(options: IPriorityOptions) {
    const { distance, rating, matchCount, rejectCount, successCount } = options;
    const distancePriority = this.calculateDistancePriority(distance);
    const ratingPriority = this.calculateRatingPriority(rating);
    const acceptCountPriority = this.calculateAcceptCountPriority(successCount);
    const acceptPercentPriority = this.calculateAcceptPercentPriority(
      matchCount,
      rejectCount,
    );
    return (
      distancePriority +
      ratingPriority +
      acceptCountPriority +
      acceptPercentPriority
    );
  }

  private calculateDistancePriority(distance: number) {
    return (0.3 * Math.abs(2500 - distance)) / 2500;
  }

  private calculateRatingPriority(rating: number) {
    return (0.2 * rating) / 5;
  }

  private calculateSuccessCountPriority(successCount: number) {
    return 0.2 * Math.E ** (-successCount / 10);
  }

  private calculateAcceptCountPriority(acceptCount: number) {
    return 0.2 * Math.E ** (-acceptCount / 10);
  }

  private calculateVariance(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    // const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const mean = 0;
    const squaredDiffs = data.map((value) => (value - mean) ** 2);
    const variance =
      squaredDiffs.reduce((sum, value) => sum + value, 0) / data.length;
    return variance;
  }

  private calculateNormalDistribution(
    x: number,
    mean: number,
    variance: number,
  ) {
    const sd = Math.sqrt(variance); // độ lệch chuẩn
    const dividend = Math.exp(-((x - mean) ** 2) / (2 * variance)); // tử số
    const divisor = sd * Math.sqrt(2 * Math.PI); // mẫu số
    return dividend / divisor;
  }

  private calculateAcceptPercentPriority(
    matchCount: number,
    rejectCount: number,
  ) {
    const percent =
      matchCount !== 0 ? (matchCount - rejectCount) / matchCount : 1;
    return 0.3 * percent;
  }
}
