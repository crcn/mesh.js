import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";
import { proxy } from "./proxy";

/**
 * Executes a message against target function if filter returns true, otherwise execute a message against falsy function is provided.
 */

export const conditional = <T>(_if: (...args) => boolean, _then?: Function, _else?: Function) => proxy((...args) => _if(...args) ? _then : _else);
