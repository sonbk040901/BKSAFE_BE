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
