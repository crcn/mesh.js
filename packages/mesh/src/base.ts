import { DuplexAsyncIterableIterator } from "./duplex";

interface DuplexIterableIterator<TInput, TOutput> extends AsyncIterableIterator<TOutput> {
  next(value?: TInput): Promise<IteratorResult<TOutput>>;
}