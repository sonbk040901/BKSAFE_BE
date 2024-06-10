import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('cars')
export class Car extends BaseEntity {
  @Column()
  make: string; // Hãng sản xuất của xe ô tô (ví dụ: Toyota, Honda, Ford)
  @Column()
  model: string; // Mẫu xe ô tô (ví dụ: Camry, Civic, Focus).
  @Column()
  year: number; // Năm sản xuất của xe ô tô.
  @Column()
  color: string; // Màu sắc của xe ô tô.
  @Column()
  licensePlateNumber: string; // Biển số xe ô tô (có thể là một trường duy nhất để xác định xe).
  @Column()
  vin: string; //(Vehicle Identification Number): Số VIN của xe ô tô (nếu cần).
  @Column()
  transmission: string; //Loại hộp số (ví dụ: Tự động, Số sàn).
}
