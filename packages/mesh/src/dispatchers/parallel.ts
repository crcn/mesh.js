import { createFanoutDispatcher, FanoutDispatcherTargetsParamType } from "./fanout";

/**
 * Executes a message against all target dispatchers at the same time.
 */

export const createParallelDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets, <T>(items:T[], each: (value: T) => Promise<any>) => {
  return Promise.all(items.map(each));
});
