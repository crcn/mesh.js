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
    const inputBuffers = Array.from({ length: dispatchers.length }).map(v => []);
    let running;

    const start = () => {
      iterator(dispatchers, async dispatch => {
        const index = dispatchers.indexOf(dispatch);
        const inputBuffer = inputBuffers[index];
        const iter = wrapAsyncIterableIterator(dispatch(message));
        while(true) {
          const { value, done } = await iter.next(inputBuffer.shift());
          if (done) break;
          await q.unshift(value);
        }
      }).then(() => q.done(), e => q.error(e));
    }

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next(value: TInput) {
        if (value != null) {
          for (const buffer of inputBuffers) {
            buffer.push(value);
          }
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
