import { max } from "./max";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export const once = (fn: Function) => max(fn, 1);