import { Queue, createQueue } from "./queue";

export interface DuplexAsyncIterableIterator<TInput, UOutput> extends AsyncIterableIterator<UOutput> {
  next(input?: TInput): Promise<IteratorResult<UOutput>>;
}

export const createDuplex = <TInput, TOutput>(handler: (input: Queue<TInput>, output: Queue<TOutput>) => any): DuplexAsyncIterableIterator<TInput, TOutput> => {
  const input  = createQueue<TInput>();
  const output = createQueue<TOutput>();
  let running: boolean;
  const start = () => {
    if (running) {
      return;
    }
    running = true;
    handler(input, output);
  }

  return {
    [Symbol.asyncIterator]: () => this,
    next(value: TInput) {
      start();
      input.unshift(value);
      return output.next();
    },
    return(value?) {
      input.return(value);
      return output.next();
    }
  };
}