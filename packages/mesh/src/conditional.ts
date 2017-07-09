import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

const noop = () => {};

/**
 * Executes a message against target function if filter returns true, otherwise execute a message against falsy function is provided.
 */

export const conditional = <T>(_if: (message: T) => boolean, _then: Function = noop, _else: Function = noop) => (message: T) => wrapAsyncIterableIterator((_if(message) ? _then : _else)(message))
