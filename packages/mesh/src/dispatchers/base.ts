import { DuplexStream } from "../streams";

export type Dispatcher<T, U> = (message: T) => U;
export type StreamableDispatcher<T> = Dispatcher<T, DuplexStream<any, any>>;
