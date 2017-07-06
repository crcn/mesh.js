import { Dispatcher } from "./base";
import {
  createQueue,
  wrapPromise,
  createDuplexStream,
  wrapAsyncIterableIterator,
} from "../streams";

export const createProxyDispatcher = <TMessage, TOutput>(getTarget?: (message?: TMessage) => Dispatcher<TMessage, TOutput> | Promise<Dispatcher<TMessage, TOutput>>) => (message: TMessage) => {
  const q = createQueue();
  const duplex = createDuplexStream();
  wrapPromise(getTarget(message)).then((dispatch) => {
    const iter = wrapAsyncIterableIterator(dispatch(message));
    const next = () => {
      duplex.input.next().then(({ value }) => {
        iter.next(value).then(({ value, done }) => {
          if (done) {
            duplex.output.done();
          } else {
            duplex.output.unshift(value).then(next);
          }
        });
      });
    };
    next();
  });

  return duplex;
}
