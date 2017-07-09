import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export function pipe(...pipeline: any[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: IterableIterator<any>[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: AsyncIterableIterator<any>[]): AsyncIterableIterator<any>;

export function pipe<TInput, TOutput>(...pipeline: any[]) {

  let _done = false;

  const targets = pipeline.map(wrapAsyncIterableIterator);

  const call = (methodName: string, value: TInput) => {
    return new Promise((resolve, reject) => {
      const remaining = targets.concat();
      const next = ({ value, done }) => {

        if (!_done) {
          _done = done;
        }

        // if one piped item finishes, then we need to finish
        if (!remaining.length || _done) return resolve({value, done});
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