import { IBus } from "./base";
import { ReadableStream } from "../streams";

export type BusCallback<T, U> = (message: T) => U;

export class CallbackBus<T, U> implements IBus<T, U> {
  constructor(readonly callback: BusCallback<T, U>) { }

  dispatch(message: T): U {
    return this.callback(message);
  }
}

export const createCallbackBus = <T, U>(callback: BusCallback<T, U>) => new CallbackBus(callback);