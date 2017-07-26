import { pump } from "./pump";
import { remote } from "./remote";
import { createQueue } from "./queue";
import { proxy } from "./proxy";
import { createDeferredPromise } from "./deferred-promise";

/**
 * Creates a new messaging channel over an existing message stream.
 */

export const inlet = (iterable: AsyncIterableIterator<any>, call: Function, info?: any) => {
  const q = createQueue();
  return remote(() => ({
    adapter: {
      send(message) {
        iterable.next(message).then(({value}) => {
          q.unshift(value);
        });
      },
      addListener(listener) {
        pump(q, listener);
      }
    }
  }), call);
}

export const outlet = (createDownstream: (upstream: (...args) => any) => (...args) => any) => {
  const input = createQueue();
  const output = createQueue();

  const { promise, resolve } = createDeferredPromise<any>();

  const upstream = remote(() => ({
    adapter: {
      send(message) {
        output.unshift(message);
      },
      addListener(listener) {
        pump(input, listener);
      }
    }
  }), proxy(() => promise));

  resolve(createDownstream(upstream));

  return {
    [Symbol.asyncIterator]: () => this,
    next(value) {
      input.unshift(value);
      return output.next();
    }
  }
}