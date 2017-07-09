import { pump } from "./pump";
import { createQueue } from "./queue";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export type IteratorType<T> = (items: T[], each: (value: T) => any) => any;

export const combine = <TMessage, TInput, TOutput>(
  fns: Function[], 
  iterator: IteratorType<Function>): ((...args: any[]) => AsyncIterableIterator<TOutput>) => {
  return (...args: any[]) => {
    const q            = createQueue();
    const inputBuffers = Array.from({ length: fns.length }).map(v => createQueue());
    let running;

    const start = () => {
      iterator(fns, call => {
        const index = fns.indexOf(call);
        const inputBuffer = inputBuffers[index];
        const iter = wrapAsyncIterableIterator(call(...args));
        const next = () => {
          return inputBuffer.next().then(({ value, done }) => {
            return iter.next(value).then(({ value, done }) => {
              if (done) {
                return;
              } else {
                return q.unshift(value).then(next);
              }
            });
          });
        };
        return next();
      }).then(() => q.done(), e => q.error(e));
    }

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next(value: TInput) {

        // signal target functions that they can yield the next value. Note that if
        // value is null or undefined, it won't count as an input
        for (const buffer of inputBuffers) {
          buffer.unshift(value);
        }
        
        if (!running) {
          running = true;
          start();
        }
        return q.next();
      }
    };
  }
}
