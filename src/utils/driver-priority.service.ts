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
    return (0.3 * Math.abs(2000 - distance)) / 2000;
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

  private calculateAcceptPercentPriority(
    matchCount: number,
    rejectCount: number,
  ) {
    const percent =
      matchCount !== 0 ? (matchCount - rejectCount) / matchCount : 1;
    return 0.3 * percent;
  }
}
