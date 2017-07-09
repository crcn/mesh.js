import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";
import { wrapPromise } from "./wrap-promise";

/**
 * await pump(stream, this.onChunk)
 */

export function pump<TOutput>(stream: Iterable<TOutput>, each: (value: TOutput) => any);
export function pump<TOutput>(stream: AsyncIterable<TOutput>, each: (value: TOutput) => any);
export function pump<TOutput>(stream: IterableIterator<TOutput>, each: (value: TOutput) => any);
export function pump<TOutput>(stream: AsyncIterableIterator<TOutput>, each: (value: TOutput) => any);

export function pump<TOutput>(source: any, each: (value: TOutput) => any) {
  return new Promise((resolve, reject) => {
    const iterable = wrapAsyncIterableIterator<any, TOutput>(source);
    const next = () => {
      iterable.next().then(({ value, done }) => {
        if (done) return resolve();
        wrapPromise(each(value)).then(next);
      }, reject);
    };
    next();
  });
}
