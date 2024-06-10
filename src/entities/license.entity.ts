import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('licenses')
export class License extends BaseEntity {
  @Column()
  frontImage: string;
  @Column()
  backImage: string;
  @Column()
  number: string;
  @Column()
  fullName: string;
  @Column()
  address: string;
  @Column()
  birthday: Date;
  @Column()
  issueDate: Date;
  @Column()
  expireDate: Date;
  @Column()
  classType: string; //B1, B2, C, D, E, F
}
