import { proxy } from "./proxy";
import { sequence } from "./sequence";
import { createQueue } from "./queue";
import { createDuplex } from "./duplex";
import { createDeferredPromise } from "./deferred-promise";

export const limit = (fn: Function, max: number = 1) => {
  
  const queue = createQueue();

  let queueCount = 0;
  
  const next = () => {
    if (queueCount >= max) {
      return;
    }
    queueCount++;
    queue.unshift(sequence(fn, () => queueCount-- && next())).then(next);
  };

  next();

  return proxy((...args) => queue.next().then(({ value }) => value));
};