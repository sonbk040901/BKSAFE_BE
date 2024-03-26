import { BaseEntity } from '~entities/baseEntity';
import { Column, Entity } from 'typeorm';

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
}
