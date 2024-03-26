import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Account } from './account.entity';
import { BaseEntity } from './baseEntity';
import { License } from './license.entity';
import { MatchingStatistic } from '~entities/matching-statistic.entity';
import { Exclude } from 'class-transformer';

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum ActivateStatus {
  ACTIVATED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  REJECTED = 'REJECTED',
}

export class Location {
  @Column({ nullable: true })
  address: string;
  @Column({ type: 'dec', nullable: true, precision: 25, scale: 20 })
  longitude: number;
  @Column({ type: 'dec', nullable: true, precision: 25, scale: 20 })
  latitude: number;
}

@Entity('drivers')
export class Driver extends BaseEntity {
  @Column({ nullable: true })
  birthday: Date;
  @Column({ nullable: true })
  address: string;
  @Column({ type: 'float', default: 5 })
  rating: number;
  @OneToOne(() => Account, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  account: Account;
  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;
  @OneToOne(() => License, { cascade: ['insert'] })
  @JoinColumn({ name: 'license_id' })
  license: License;
  @Column(() => Location)
  location: Location;
  @Exclude()
  @OneToOne(
    () => MatchingStatistic,
    (matchingStatistic) => matchingStatistic.driver,
  )
  matchingStatistic: MatchingStatistic;
  @Column({
    type: 'enum',
    enum: ActivateStatus,
    default: ActivateStatus.DEACTIVATED,
  })
  activateStatus: ActivateStatus;
}
