import { BaseEntity } from '~entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
}
