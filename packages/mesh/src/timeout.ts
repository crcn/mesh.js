import { pump } from "./pump";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

const TIMEOUT = 1000 * 115; // default TTL specified by some browsers

const createDefaultError = (...args) => new Error(`Timeout calling function.`);

export const timeout = (fn: Function, ms: number = TIMEOUT, createError = createDefaultError) => (...args) => {
  let _completed: boolean;
  let _timeout: any;
  let _error: any;

  const resetTimeout = () => {
    clearTimeout(_timeout);
    _timeout = setTimeout(() => {
      _error = createError(...args);
    }, ms);
  }

  resetTimeout();

  const iter = wrapAsyncIterableIterator(fn(...args)) as AsyncIterableIterator<any>;

  return {
    [Symbol.asyncIterator]: () => this,
    next(value?) {
      if (_error) {
        return Promise.reject(_error);
      }
      resetTimeout();
      return iter.next(value).then((result): any => {
        if (_error) return Promise.reject(_error);
        resetTimeout();
        if (result.done) {
          clearTimeout(_timeout);
        }
        return result;
      });
    }
  }
}