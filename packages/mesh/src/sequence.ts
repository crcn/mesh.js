import { combine } from "./combine";

/**
 * Executes functions in sequence
 * 
 * @example
 * 
 * 
 * const ping = sequence(
 *  () => "pong1",
 *  () => "pong2"
 * );
 * 
 * const iter = ping();
 * await iter.next(); // { value: "pong1", done: false }
 * await iter.next(); // { value: "pong2", done: false }
 * await iter.next(); // { value: undefined, done: true }
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