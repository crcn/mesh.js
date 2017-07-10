import { tee } from "./tee";
import { pump } from "./pump";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const race = (...fns: Function[]) => (...args): AsyncIterableIterator<any> => {
  return createDuplex((input, output) => {
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
            output.return();
          } else {
            output.unshift(value);
          }
        });
      }).then(() => {
        if (wonFn === fn) {
          output.return();
        }
      });
    });
  });
};