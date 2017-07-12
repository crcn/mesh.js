import { readAll } from "./read-all";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const awaitable = (fn: Function) => (...args): AsyncIterableIterator<any> & Promise<any> => {
  const iter = wrapAsyncIterableIterator(fn(...args));
  let _readingAll;
  const _readAll = () => {
    return _readingAll || (_readingAll = readAll(iter));
  };
  return {
    [Symbol.asyncIterator]: () => this,
    then(resolve, reject) {
      return _readAll().then(resolve, reject);
    },
    catch(reject) {
      return _readAll().catch(reject);
    },
    next: iter.next,
    return: iter.next,
    throw: iter.throw,
  } as any;
};