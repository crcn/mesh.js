import { tee } from "./tee";
import { pump } from "./pump";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export type IteratorType<T> = (items: T[], each: (value: T) => any) => any;

export const combine = <TInput, TOutput>(
  fns: Function[], 
  iterator: IteratorType<Function>): ((...args: any[]) => AsyncIterableIterator<TOutput>) => (...args: any[]) => createDuplexStream((input, output) => {
  let primaryInput   = input as AsyncIterableIterator<any>;

  const inputs = Array.from({ length: fns.length }).map(v => {
    let input;
    [input, primaryInput] = tee(primaryInput);
    return input;
  });

  iterator(fns, call => {
    const index = fns.indexOf(call);
    const input = inputs[index];
    const iter = wrapAsyncIterableIterator(call(...args));
    const next = () => {
      return input.next().then(({ value, done }) => {
        return iter.next(value).then(({ value, done }) => {
          if (done) {
            return;
          } else {
            return output.unshift(value).then(next);
          }
        });
      });
    };
    return next();
  }).then(() => output.done(), e => output.error(e));
});

