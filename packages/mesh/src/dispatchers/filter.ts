import { Dispatcher } from "./base";
import { wrapDuplexStream } from "../streams";

const noop = () => {};

/**
 * Executes a message against target bus if filter returns true, otherwise execute a message against falsy bus is provided.
 */

export const createFilterBus = <T>(testMessage: (message: T) => boolean, resolvedTarget: Dispatcher<T, any> = noop, rejectedTarget: Dispatcher<T, any> = noop) => message => wrapDuplexStream((testMessage(message) ? resolvedTarget : rejectedTarget)(message))
