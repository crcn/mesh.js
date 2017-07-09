import { wrapPromise } from "./wrap-promise";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const proxy = <TMessage, TOutput>(getFn?: (...args: any[]) => Function | Promise<Function>) => (message: TMessage) => {
  return createDuplexStream((input, output) => {
    wrapPromise(getFn(message)).then((fn) => {
      const iter = wrapAsyncIterableIterator(fn(message));
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
