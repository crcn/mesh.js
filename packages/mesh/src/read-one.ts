import { pump } from "./pump";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const readOne = (value: any, done?: boolean) => new Promise((resolve, reject) => {
  const iterable = wrapAsyncIterableIterator(value);
  iterable.next().then(({ value, done }) => {
    resolve(value);
    if (done) {
      iterable.return();
    }
  }, reject);
});