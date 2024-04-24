import { PagingAndSortDto } from './paging-and-sort.dto';

export class PagingResponseDto<T> {
  data: T[] = [];
  total: number = 0;
  take: number = 0;
  skip: number = 0;
  order: 'asc' | 'desc' = 'asc';
  sort: string;

  constructor(data: T[], total: number, pagination?: PagingAndSortDto) {
    if (pagination) {
      this.setPagination(pagination);
    }
    this.total = total;
    this.data = data;
  }

  setPagination(pagination: PagingAndSortDto) {
    this.take = pagination.take;
    this.skip = pagination.skip;
    this.order = pagination.order;
    this.sort = pagination.sort;
  }
}
