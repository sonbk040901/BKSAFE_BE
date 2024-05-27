import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Booking } from '~entities/booking.entity';
import { Driver } from '~entities/driver.entity';

@Entity('booking_suggest_drivers')
export class BookingSuggestDriver {
  @PrimaryColumn()
  bookingId: number;
  @PrimaryColumn()
  driverId: number;
  @Column({ default: false })
  isRejected: boolean;
  @OneToOne(() => Booking, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
  @OneToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
