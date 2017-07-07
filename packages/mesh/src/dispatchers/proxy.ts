import { Dispatcher } from "./base";
import {
  wrapPromise,
  createDuplexStream,
  wrapAsyncIterableIterator,
} from "../utils";

export const createProxyDispatcher = <TMessage, TOutput>(getTarget?: (message?: TMessage) => Dispatcher<TMessage, TOutput> | Promise<Dispatcher<TMessage, TOutput>>) => (message: TMessage) => {
  return createDuplexStream((input, output) => {
    wrapPromise(getTarget(message)).then((dispatch) => {
      const iter = wrapAsyncIterableIterator(dispatch(message));
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
