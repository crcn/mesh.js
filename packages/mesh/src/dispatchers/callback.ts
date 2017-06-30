import { Dispatcher } from "./base";
export type DispatchCallback<T, U> = (message: T) => U;

export const createCallbackDispatcher = <T, U>(callback: DispatchCallback<T, U>) => (message: T) => callback(message)
