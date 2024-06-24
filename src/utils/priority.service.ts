import { Injectable } from '@nestjs/common';

@Injectable()
export class PriorityService {
  calculateVariance(data: number[]) {
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

  calculateNormalDistribution(x: number, variance: number) {
    const mean = 0;
    const sd = Math.sqrt(variance); // độ lệch chuẩn
    const dividend = Math.exp(-((x - mean) ** 2) / (2 * variance)); // tử số
    const divisor = sd * Math.sqrt(2 * Math.PI); // mẫu số
    return dividend / divisor;
  }

  calculate(options: {
    distance: number;
    rating: number;
    matchCount: number;
    rejectCount: number;
    normalDistribution: number;
    maxNormalDistribution: number;
  }) {
    const {
      distance,
      rating,
      matchCount,
      rejectCount,
      normalDistribution,
      maxNormalDistribution,
    } = options;
    const distancePriority = this.calculateDistancePriority(distance);
    const ratingPriority = this.calculateRatingPriority(rating);
    const acceptPercentPriority = this.calculateAcceptPercentPriority(
      matchCount,
      rejectCount,
    );
    const acceptCountPriority = this.calculateAcceptCountPriority(
      normalDistribution,
      maxNormalDistribution,
    );
    return (
      distancePriority +
      ratingPriority +
      acceptPercentPriority +
      acceptCountPriority
    );
  }
  private calculateDistancePriority(distance: number) {
    return (0.25 * Math.abs(2500 - distance)) / 2500;
  }
  private calculateRatingPriority(rating: number) {
    return (0.2 * rating) / 5;
  }
  private calculateAcceptCountPriority(
    normalDistributions: number,
    maxNormalDistribution: number,
  ) {
    return (0.35 * normalDistributions) / maxNormalDistribution;
  }
  private calculateAcceptPercentPriority(
    matchCount: number,
    rejectCount: number,
  ) {
    const percent =
      matchCount !== 0 ? (matchCount - rejectCount) / matchCount : 1;
    return 0.2 * percent;
  }
}
