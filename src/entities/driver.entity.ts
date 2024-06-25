import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Account } from './account.entity';
import { License } from './license.entity';
import { MatchingStatistic } from '~entities/matching-statistic.entity';
import { Exclude, Transform } from 'class-transformer';
import { BookingSuggestDriver } from '~entities/booking-suggest-driver.entity';
import { RoleName } from '~/common/enums/role-name.enum';
import { Cccd } from './cccd.entity';
import { Booking } from './booking.entity';

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum RegisterStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Location {
  @Column({ nullable: true })
  address: string;
  @Column({ type: 'dec', nullable: true, precision: 25, scale: 20 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  longitude: number;
  @Column({ type: 'dec', nullable: true, precision: 25, scale: 20 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  latitude: number;
}

@Entity('drivers')
export class Driver extends Account {
  @Column({ nullable: true })
  birthday: Date;
  @Column({ nullable: true })
  address: string;
  @Column({ type: 'float', default: 5 })
  rating: number;
  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;
  @OneToOne(() => License, { cascade: ['insert'] })
  @JoinColumn({ name: 'license_id' })
  license: License;
  @OneToOne(() => Cccd, { cascade: ['insert'] })
  @JoinColumn({ name: 'cccd_id' })
  cccd: Cccd;
  @Column(() => Location)
  location: Location;
  @Exclude()
  @OneToOne(
    () => MatchingStatistic,
    (matchingStatistic) => matchingStatistic.driver,
    { cascade: ['insert', 'update'] },
  )
  matchingStatistic: MatchingStatistic;
  @Column({
    type: 'enum',
    enum: RegisterStatus,
    default: RegisterStatus.PENDING,
  })
  registerStatus: RegisterStatus;
  @OneToOne(() => BookingSuggestDriver, (target) => target.driver)
  bookingSuggestDriver: BookingSuggestDriver;

  @OneToMany(() => Booking, (target) => target.driver)
  bookings: Booking[];

  isRegisterStatusAccepted(): boolean {
    return this.registerStatus === RegisterStatus.ACCEPTED;
  }

  getRole(): RoleName {
    return RoleName.DRIVER;
  }
}
