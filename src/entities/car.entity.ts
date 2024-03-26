import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity('cars')
export class Car extends BaseEntity {
  @Column()
  make: string;
  @Column()
  model: string;
  @Column()
  year: number;
  @Column()
  color: string;
  @Column()
  licensePlateNumber: string;
  @Column()
  vin: string;
  @Column()
  transmission: string;
}
