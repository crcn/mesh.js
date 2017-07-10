import { wrapPromise } from "./wrap-promise";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const proxy = <TOutput>(getFn?: (...args: any[]) => Function | Promise<Function>) => (...args) => {
  return createDuplexStream((input, output) => {
    wrapPromise(getFn(...args)).then((fn) => {
      const iter = wrapAsyncIterableIterator(fn(...args));
      const next = () => {
        input.next().then(({ value }) => {
          iter.next(value).then(({ value, done }) => {
            if (done) {
              output.done();
            } else {
              output.unshift(value).then(next);
            }
          });
        });
      };
      next();
    });
  });
}
