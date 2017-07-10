import { pump } from "./pump";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const fallback = (...fns: Function[]) => (...args) => {
  return createDuplex((input, output) => {
    const targets = fns.concat();
    const buffer  = [];

    const nextTarget = () => {
      const targetFn = targets.shift();

      if (!targetFn) {
        return output.return();
      }

      const targetIter = wrapAsyncIterableIterator(targetFn(...args));
      let hasData = false;

      const next = (value) => {

        return targetIter.next(value).then(({value, done}) => {
          if (!hasData) {
            hasData = !done;
          }

          if (hasData) {
            if (done) {
              output.return();
            } else {
              output.unshift(value);
            }
          }

          // if there is data, then use the current target, otherwise
          // freeze with a promise that never resolves & move onto the next target
          return hasData ? true : new Promise(() => {
            nextTarget();
          })
        }, (e) => {
          if (targets.length && !hasData) {
            nextTarget();
          } else {
            output.throw(e);
          }
        });
      }

      const pumpInput = () => {
        return input.next().then(({ value, done }) => {
          if (done) {
            return targetIter.return(value);
          } else {
            buffer.push(value);
            return next(value).then(pumpInput);
          }
        });
      };
      
      pump(buffer, next).then(pumpInput);
    }

    nextTarget();
  });
};