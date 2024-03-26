import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { Booking } from './booking.entity';

export enum LocationType {
  //Điểm đón tài xế
  PICKUP = 'PICKUP',
  //Điểm dừng
  STOP = 'STOP',
  //Điểm trả khách
  DROP_OFF = 'DROP_OFF',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  address: string;
  @Column({ type: 'float' })
  longitude: number;
  @Column({ type: 'float' })
  latitude: number;
  @Column({ type: 'enum', enum: LocationType, default: LocationType.PICKUP })
  @Transform(({ value }) => LocationType[value])
  type: LocationType;
  @Column()
  bookingId: number;
  @ManyToOne(() => Booking, (booking) => booking.locations)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
