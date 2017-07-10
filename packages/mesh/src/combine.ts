import { tee } from "./tee";
import { pump } from "./pump";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export type IteratorType<T> = (items: T[], each: (value: T) => any) => any;

export const combine = <TInput, TOutput>(
  fns: Function[], 
  iterator: IteratorType<Function>) => (...args: any[]) => createDuplex((input, output) => {
  let primaryInput   = input as AsyncIterableIterator<any>;

  const inputs = Array.from({ length: fns.length }).map(v => {
    let input;
    [input, primaryInput] = tee(primaryInput);
    return input;
  });

  let pending: AsyncIterableIterator<any>[] = [];

  const returnPending = (value) => {
    for (const iter of pending) {
      iter.return(value);
    }
  }

  iterator(fns, call => {
    const index = fns.indexOf(call);
    const input = inputs[index];
    const iter = wrapAsyncIterableIterator(call(...args));
    pending.push(iter);
    const next = () => {
      return input.next().then(({ value, done }) => {
        if (done) {
          returnPending(value);
          return;
        }
        return iter.next(value).then(({ value, done }) => {
          if (done) {
            pending.splice(pending.indexOf(iter), 1);
            return;
          } else {
            return output.unshift(value).then(next);
          }
        });
      });
    };
    return next();
  }).then(output.return, output.throw);
});

