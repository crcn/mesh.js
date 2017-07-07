import { FanoutDispatcherTargetsParamType, createFanoutDispatcher } from "./fanout";

/**
 * Executes a message against all target dispatchers in one after the other.
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