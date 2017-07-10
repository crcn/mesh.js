import { tee } from "./tee";
import { pump } from "./pump";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const race = (...fns: Function[]) => (...args): AsyncIterableIterator<any> => {
  return createDuplexStream((input, output) => {
    let primaryInput = input as AsyncIterableIterator<any>;
    let wonFn;
    fns.forEach((fn, i) => {
      let spareInput;
      [spareInput, primaryInput] = tee(primaryInput);
      const iter =  wrapAsyncIterableIterator(fn(...args));
      
      pump(spareInput, (value) => {
        return iter.next(value).then(({ value, done }) => {
          if (wonFn && wonFn !== fn) {
            return;
          }
          wonFn = fn;
          if (done) {
            output.done();
          } else {
            output.unshift(value);
          }
        });
      }).then(() => {
        if (wonFn === fn) {
          output.done();
        }
      });
    });
  });
};