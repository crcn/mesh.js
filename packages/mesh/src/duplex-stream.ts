import { Queue, createQueue } from "./queue";

export interface DuplexStream<TInput, UOutput> extends AsyncIterableIterator<UOutput> {
  next(input?: TInput): Promise<IteratorResult<UOutput>>;
}

export const createDuplexStream = <TInput, TOutput>(handler: (input: Queue<TInput>, output: Queue<TOutput>) => any): DuplexStream<TInput, TOutput> => {
  const input  = createQueue<TInput>();
  const output = createQueue<TOutput>();

  handler(input, output);

  return {
    [Symbol.asyncIterator]: () => this,
    next(value: TInput) {
      input.unshift(value);
      return output.next();
    }
  };
}