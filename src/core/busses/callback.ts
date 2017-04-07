import { IBus } from "./base";
import { ReadableStream } from "../streams";

export type DispatcherCallback<T, U> = (message: T) => U;

export class CallbackBus<T, U> implements IDispatcher<T, U> {
  constructor(readonly callback: DispatcherCallback<T, U>) { }

  dispatch(message: T): U {
    return this.callback(message);
  }
}