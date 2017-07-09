import { combine } from "./combine";

/**
 * Executes a message against all target functions at the same time.
 */

export const parallel = <T>(...fns: Function[]) => combine(fns, <T>(items:T[], each: (value: T) => Promise<any>) => {
  return Promise.all(items.map(each));
});
