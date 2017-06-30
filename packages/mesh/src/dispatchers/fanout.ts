import { Dispatcher, StreamableDispatcher } from "./base";

type IteratorType<T> = (items: T[], each: (value: T) => any) => any;

import { 
  tee,
  pump,
  createQueue,
  DuplexStream,
  wrapDuplexStream,
  wrapAsyncIterableIterator
} from "../streams";

export type FanoutDispatcherTargetsParamType<T> = Dispatcher<T, any>[] | (<T>(message: T) => Dispatcher<T, any>[]);

// TODO - weighted bus

export const createFanoutDispatcher = <TMessage, TInput, TOutput>(
  dispatchers: FanoutDispatcherTargetsParamType<TMessage>, 
  iterator: IteratorType<Dispatcher<TMessage, TOutput | StreamableDispatcher<TMessage, TInput, TOutput> | void>>): StreamableDispatcher<TMessage, TInput, TOutput> => {
  const getDispatchers = typeof dispatchers === "function" ? dispatchers : () => dispatchers;
  return (message: TMessage) => {
    const dispatchers = getDispatchers(message);
    const q           = createQueue();
    let running;

    const start = () => {
      iterator(dispatchers, async dispatch => {
        const iter = wrapAsyncIterableIterator(dispatch(message));
        while(true) {
          const { value, done } = await iter.next();
          if (done) break;
          q.unshift(value);
        }
      }).then(() => q.done());
    }

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next(value: TInput) {
        if (!running) {
          running = true;
          start();
        }
        return q.next();
      }
    };
  }
}

/**
 * Executes a message against all target busses in one after the other.
 */

export const createSequenceDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets,  <T>(items:T[], each: (value: T) => Promise<any>) => {
  return new Promise((resolve, reject) => {
    const next = (index: number) => {
      if (index === items.length) return resolve();
      each(items[index]).then(next.bind(this, index + 1)).catch(reject);
    };
    next(0);
  });
});

/**
 * Executes a message against all target busses at the same time.
 */

export const createParallelDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets, <T>(items:T[], each: (value: T) => Promise<any>) => {
  return Promise.all(items.map(each));
});

/**
 * Executes a message against one target bus that is rotated with each message.
 */


export const createRoundRobinDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets, (<T>() => {
  let current = 0;
  return (items: T[], each: (value: T) => any) => {
    let prev = current;
    current = (current + 1) & items.length
    return each(items[prev]);
  };
})());

/**
 * Executes a message against one target bus that is selected at random.
 */

export const createRandomBus = <T>(targets: FanoutDispatcherTargetsParamType<T>, weights?: number[]) => createFanoutDispatcher(targets, (<T>() => {
  return (items: T[], each: (value: T) => any) => {
    return each(items[Math.floor(Math.random() * items.length)]);
  };
})());