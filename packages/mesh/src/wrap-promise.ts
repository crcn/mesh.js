
export function wrapPromise<TValue>(value: TValue | Promise<TValue>): Promise<TValue> {
  if (value && value["then"]) return value as Promise<TValue>;
  return Promise.resolve(value);
}
