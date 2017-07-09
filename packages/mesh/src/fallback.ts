import { Dispatcher } from "./base";
import { pump } from "./pump";
import { createDuplexStream } from "./duplex-stream";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const fallback = <TMessage>(...fns: Function[]) => {
  return (message: TMessage) => {
    return createDuplexStream((input, output) => {
      const targets = fns.concat();
      const buffer  = [];

      const nextTarget = () => {
        const targetDispatch = targets.shift();

        if (!targetDispatch) {
          return output.done();
        }

        const targetIter = wrapAsyncIterableIterator(targetDispatch(message));
        let hasData = false;

        const next = (value) => {
          return targetIter.next(value).then(({value, done}) => {
            if (!hasData) {
              hasData = !done;
            }

            if (hasData) {
              if (done) {
                output.done();
              } else {
                output.unshift(value);
              }
            }

            // if there is data, then use the current target, otherwise
            // freeze with a promise that never resolves & move onto the next target
            return hasData ? true : new Promise(() => {
              nextTarget();
            })
          });
        }

        const pumpInput = () => {
          return input.next().then(({value}) => {
            buffer.push(value);
            return next(value);
          }).then(pumpInput);
        };
        
        pump(buffer, next).then(pumpInput);
      }

      nextTarget();
    });
  }
}