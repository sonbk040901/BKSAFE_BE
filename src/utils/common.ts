import { camelCase as defaultCamelCase } from 'typeorm/util/StringUtils';

export const ignoreExceptions = async <D, T extends (...args: any[]) => D>(
  v: Promise<D> | T,
  ...args: Parameters<T>
) => {
  try {
    if (typeof v === 'function') return await v(...args);
    return await v;
  } catch (error) {
    console.error(error);
  }
};

export const isCurrent = (
  date: Date | string,
  type: 'day' | 'month' | 'year' = 'day',
) => {
  try {
    const parsedDate = new Date(date);
    const currentDate = new Date();
    const isCurrentYear =
      parsedDate.getFullYear() === currentDate.getFullYear();
    if (type === 'year') return isCurrentYear;
    const isCurrentMonth =
      isCurrentYear && parsedDate.getMonth() === currentDate.getMonth();
    if (type === 'month') return isCurrentMonth;
    return isCurrentMonth && parsedDate.getDate() === currentDate.getDate();
  } catch (error) {
    return false;
  }
};
export const daysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
};
export const camelCase = <
  T extends string | readonly string[] | { [k: string]: unknown },
>(
  input: T,
): T extends string | readonly string[] ? string : { [k: string]: any } => {
  if (typeof input === 'object' && !Array.isArray(input)) {
    const obj: { [k: string]: unknown } = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        obj[defaultCamelCase(key)] = input[key];
      }
    }
    return obj as any;
  }
  if (typeof input === 'string') return defaultCamelCase(input) as any;
  return defaultCamelCase(input.join('_')) as any;
};
