import { wrapPromise } from "./wrap-promise";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const proxy = <TOutput>(getFn?: (...args: any[]) => Function | Promise<Function>) => (...args) => {
  return createDuplex((input, output) => {
    wrapPromise(getFn(...args)).then((fn) => {
      const iter = wrapAsyncIterableIterator(fn(...args));
      const next = () => {
        input.next().then(({ value, done }) => {
          if (done) {
            return iter.return(value);
          }
          iter.next(value).then(({ value, done }) => {
            if (done) {
              output.return();
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
