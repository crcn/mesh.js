import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export function pipe(...pipeline: any[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: IterableIterator<any>[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: AsyncIterableIterator<any>[]): AsyncIterableIterator<any>;

/**
 * Pipes yielded data though each iterable in the pipeline
 *  
 * @param {AsyncIterableIterator|IterableIterator} source the first iterable in the pipeline
 * @param {AsyncIterableIterator|IterableIterator} [through] proceeding iterables to pass yielded data through
 * 
 * @example
 * import { pipe, through, readAll } from "mesh";
 * 
 * const negate = (values) => pipe(
 *   values,
 *   through(a => -a)
 * );
 * 
 * const negativeValues = await readAll(negate([1, 2, 3])); // [-1, -2, -3]
 * 
 */

export function pipe<TInput, TOutput>(...items: any[]) {

  let _done = false;

  const targets = items.map(wrapAsyncIterableIterator);

  const call = (methodName: string, value: TInput) => {
    return new Promise((resolve, reject) => {
      const remaining = targets.concat();
      const next = ({ value, done }) => {

        if (!_done) {
          _done = done;
        }

        // if one piped item finishes, then we need to finish
        if (!remaining.length || _done) {
          if (methodName === "next") {
            while(remaining.length) {
              (remaining.shift().return || (() => {}))();
            }
          }
          return resolve({ value, done });
        }
        const fn = remaining.shift()[methodName];
        return fn ? fn(value).then(next, reject) : next(value);
      }
      next({ value, done: false });
    });
  };

  return {
    [Symbol.asyncIterator]: () => this,
    next: call.bind(this, "next"),
    return: call.bind(this, "return"),
    throw: call.bind(this, "throw")
  };
}
