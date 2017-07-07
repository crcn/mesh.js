import { Dispatcher } from "./base";
import { wrapAsyncIterableIterator } from "../utils";

const noop = () => {};

/**
 * Executes a message against target dispatcher if filter returns true, otherwise execute a message against falsy dispatcher is provided.
 */

export const createConditionalDispatcher = <T>(_if: (message: T) => boolean, _then: Dispatcher<T, any> = noop, _else: Dispatcher<T, any> = noop) => (message: T) => wrapAsyncIterableIterator((_if(message) ? _then : _else)(message))
