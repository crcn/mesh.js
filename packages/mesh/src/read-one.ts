import { pump } from "./pump";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const readOne = (value: any, ret?: boolean) => new Promise((resolve, reject) => {
  const iterable = wrapAsyncIterableIterator(value);
  iterable.next().then(({ value, done }) => {
    resolve(value);
    if (ret !== false) {
      iterable.return();
    }
  }, reject);
});