import { DuplexStream } from "../streams";

interface DuplexIterableIterator<TInput, TOutput> extends AsyncIterableIterator<TOutput> {
  next(value?: TInput): Promise<IteratorResult<TOutput>>;
}

export type Dispatcher<TMessage, UOutput> = (message: TMessage) => UOutput;
export type StreamableDispatcher<TMessage, UInput, VOutput> = Dispatcher<TMessage, DuplexIterableIterator<UInput, VOutput>>;
