import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Note } from '~entities/note.entity';
import { genFindOperator } from '~repos/utils';

@Injectable()
export class NoteRepository extends Repository<Note> {
  constructor(dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }

  findById(id: number | number[]): Promise<Note[]> {
    return this.find({
      where: { id: genFindOperator(id) },
    });
  }
}
