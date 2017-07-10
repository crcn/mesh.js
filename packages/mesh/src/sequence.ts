import { combine } from "./combine";

/**
 * Executes async generator functions in sequence 
 */

export const sequence = <T>(...fns: Function[]) => combine(fns,  <T>(items:T[], each: (value: T) => Promise<any>) => {
  return new Promise((resolve, reject) => {
    const next = (index: number) => {
      if (index === items.length) return resolve();
      each(items[index]).then(next.bind(this, index + 1)).catch(reject);
    };
    next(0);
  });
});