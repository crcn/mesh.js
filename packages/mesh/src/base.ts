import { DuplexStream } from "./duplex-stream";

interface DuplexIterableIterator<TInput, TOutput> extends AsyncIterableIterator<TOutput> {
  next(value?: TInput): Promise<IteratorResult<TOutput>>;
}