import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Driver } from '~entities/driver.entity';

// Thống kê số lượng các chuyến đi
@Entity('matching_statistics')
export class MatchingStatistic {
  @PrimaryGeneratedColumn()
  id: number;
  // Tổng số được chuyến đi hệ thống ghép cho tài xế
  @Column({ type: 'int', default: 0 })
  total: number;
  // Số chuyến đi thành công
  @Column({ type: 'int', default: 0 })
  success: number;
  // Số chuyến đi tài xế chấp nhận
  @Column({ type: 'int', default: 0 })
  accept: number;
  // Số chuyến đi thất bại
  @Column({ type: 'int', default: 0 })
  fail: number;
  // Số chuyến bị tài xế từ chối
  @Column({ type: 'int', default: 0 })
  reject: number;
  @Column()
  driverId: number;
  @JoinColumn({ name: 'driver_id' })
  @OneToOne(() => Driver, { cascade: false })
  driver: Driver;
}
