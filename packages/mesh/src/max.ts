import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const max = (fn: Function, count: number = 1) => {
  let _numCalls: number = 0;
  return (...args) => ++_numCalls > count ? wrapAsyncIterableIterator(undefined) : fn(...args);
}