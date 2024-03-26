import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Account } from './account.entity';
import { Location } from './location.entity';
import { Transform } from 'class-transformer';
import { Note } from '~entities/note.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  DRIVING = 'DRIVING',
  COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column()
  price: number;
  @Column({ type: 'float', nullable: true })
  rating: number;
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
  @Column({ nullable: true })
  nextLocationId: number;
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
  user: Account;
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'driver_id' })
  driver: Account;
}
