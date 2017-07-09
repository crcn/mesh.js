import { combine, FanoutDispatcherTargetsParamType } from "./combine";

/**
 * Executes a message against all target dispatchers at the same time.
 */

export const parallel = <T>(...fns: Function[]) => combine(fns, <T>(items:T[], each: (value: T) => Promise<any>) => {
  return Promise.all(items.map(each));
});
