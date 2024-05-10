import { In } from 'typeorm';

export const genFindOperator = <T = unknown>(value: T[] | T) => {
  return value instanceof Array ? In(value) : value;
};
