import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MappingPipe implements PipeTransform {
  constructor(private mapper: (value: any) => unknown) {}

  transform(value: any[]) {
    return value.map(this.mapper);
  }
}
