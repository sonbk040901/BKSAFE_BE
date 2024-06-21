import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('cccds')
export class Cccd extends BaseEntity {
  @Column()
  frontImage: string;
  @Column()
  backImage: string;
  @Column()
  fullName: string;
  @Column()
  number: string;
  @Column()
  address: string;
  @Column()
  birthday: Date;
  @Column()
  issueDate: Date;
  @Column()
  expireDate: Date;
}
