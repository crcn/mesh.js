import { Dispatcher, StreamableDispatcher } from "./base";

export type IteratorType<T> = (items: T[], each: (value: T) => any) => any;

import {
  pump,
  createQueue,
  DuplexStream,
  wrapDuplexStream,
  wrapAsyncIterableIterator
} from "../streams";

export type FanoutDispatcherTargetsParamType<T> = Dispatcher<T, any>[] | (<T>(message: T) => Dispatcher<T, any>[]);

export const createFanoutDispatcher = <TMessage, TInput, TOutput>(
  dispatchers: FanoutDispatcherTargetsParamType<TMessage>, 
  iterator: IteratorType<Dispatcher<TMessage, TOutput | StreamableDispatcher<TMessage, TInput, TOutput> | void>>): StreamableDispatcher<TMessage, TInput, TOutput> => {
  const getDispatchers = typeof dispatchers === "function" ? dispatchers : () => dispatchers;
  return (message: TMessage) => {
    const dispatchers  = getDispatchers(message);
    const q            = createQueue();
    const inputBuffers = Array.from({ length: dispatchers.length }).map(v => createQueue());
    let running;

    const start = () => {
      iterator(dispatchers, dispatch => {
        const index = dispatchers.indexOf(dispatch);
        const inputBuffer = inputBuffers[index];
        const iter = wrapAsyncIterableIterator(dispatch(message));
        const next = () => {
          return inputBuffer.next().then(({ value, done }) => {
            return iter.next(value).then(({ value, done }) => {
              if (done) {
                return;
              } else {
                return q.unshift(value).then(next);
              }
            });
          });
        };
        return next();
      }).then(() => q.done(), e => q.error(e));
    }

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next(value: TInput) {

        // signal target dispatchers that they can yield the next value. Note that if
        // value is null or undefined, it won't count as an input
        for (const buffer of inputBuffers) {
          buffer.unshift(value);
        }
        if (!running) {
          running = true;
          start();
        }
        return q.next();
      }
    };
  }
}
