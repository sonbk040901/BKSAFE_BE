import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Note } from '~entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<Note> {
  constructor(dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }
}
