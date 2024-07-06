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

export const camelCase = <T extends string | readonly string[] | object>(
  input: T,
): T extends object ? Record<string, unknown> : string => {
  if (typeof input === 'object' && !Array.isArray(input)) {
    const obj: object = {};
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

export const extract = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result: any = {};
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};

export const exclude = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result: any = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};
