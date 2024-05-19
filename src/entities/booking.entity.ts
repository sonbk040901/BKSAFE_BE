import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Account } from './account.entity';
import { Location } from './location.entity';
import { Transform } from 'class-transformer';
import { Note } from '~entities/note.entity';
import { BookingSuggestDriver } from '~entities/booking-suggest-driver.entity';

/**
 * * `PENDING`: Chờ xác nhận (đang chờ admin xác nhận)
 * * `ACCEPTED`: Đã được admin xác nhận, đang tìm tài xế
 * * `RECEIVED`: Đã có tài xế nhận, đang tới điểm đón
 * * `DRIVING`: Đang thực hiện chuyến đi
 * * `REJECTED`: Bị admin từ chối
 * * `CANCELLED`: Người dùng hủy chuyến
 * * `COMPLETED`: Hoàn thành chuyến
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  RECEIVED = 'RECEIVED',
  DRIVING = 'DRIVING',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column()
  price: number;
  @Column({ type: 'float', nullable: true })
  rating: number;
  @Column({ nullable: true })
  review: string;
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  @Transform(({ value }) => BookingStatus[value])
  status: BookingStatus;
  @Column({ nullable: true })
  startTime: Date;
  @Column({ nullable: true })
  endTime: Date;
  @OneToMany(() => Location, (location) => location.booking, {
    cascade: ['insert'],
  })
  locations: Location[];
  @Column({ nullable: true, type: 'int' })
  nextLocationId: number | null;
  @Column({ nullable: true })
  userId: number;
  @Column({ nullable: true })
  driverId: number;
  @Column({ nullable: true })
  note: string;
  @ManyToMany(() => Note, { nullable: true })
  @JoinTable({
    name: 'booking_notes',
    joinColumn: { name: 'booking_id' },
    inverseJoinColumn: { name: 'note_id' },
  })
  notes: Note[];
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'user_id' })
  user: Account | null;
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'driver_id' })
  driver: Account | null;
  @OneToOne(() => BookingSuggestDriver, (target) => target.booking, {
    cascade: ['insert', 'update'],
  })
  bookingSuggestDriver: BookingSuggestDriver;

  get pickupLocation() {
    return this.locations.find((l) => l.type === 'PICKUP')!;
  }

  get dropOffLocation() {
    return this.locations.find((l) => l.type === 'DROP_OFF')!;
  }

  get stopLocations() {
    return this.locations.filter((l) => l.type === 'STOP');
  }
}
