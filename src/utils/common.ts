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
