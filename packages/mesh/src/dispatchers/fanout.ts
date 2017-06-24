import { Bus, StreamableBus } from "./base";

type IteratorType<T> = (items: T[], each: (value: T) => Promise<any>) => Promise<any>;

import { 
  pump,
  DuplexStream,
  ReadableStream,
  WritableStream,
  wrapDuplexStream,
  createDuplexStream,
  ReadableStreamDefaultReader
} from "../streams";


export type FanoutDispatcherTargetsParamType<T> = Bus<T, any>[] | (<T>(message: T) => Bus<T, any>[]);

// TODO - weighted bus

export const createFanoutDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>, iterator: IteratorType<Bus<T, any>>) => {
  const getTagets = typeof targets === "function" ? targets : () => targets;
  return (message: T) => createDuplexStream((input, output) => {
    const writer = output.getWriter();

    let spare: ReadableStream<any> = input, child: ReadableStream<any>;

    let pending = 0;
    iterator(this.getTargets(message), (dispatch: Bus<T, any>) => {

      let response = dispatch(message);

      if (response == null) {
        return Promise.resolve();
      }

      [spare, child] = spare.tee();
      response = wrapDuplexStream(response);
      pending++;

      return child
      .pipeThrough(response)
      .pipeTo(new WritableStream({
          write(chunk) {
            return writer.write(chunk);
          },
          close: () => pending--,
          abort: () => pending--
        }))
      })
      .then(writer.close.bind(writer))
      .catch(writer.abort.bind(writer))
      .catch((e) => { });
  });
}

/**
 * Executes a message against all target busses in one after the other.
 */

export const createSequenceBus = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets,  <T>(items:T[], each: (value: T) => Promise<any>) => {
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