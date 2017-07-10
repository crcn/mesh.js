import { pump } from "./pump";
import { createQueue } from "./queue";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export function through<TInput, TOutput>(fn: (input: TInput) => TOutput, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => IterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => AsyncIterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;

// TODO - possibly endOnNoInput
export function through<TInput>(fn: (input: TInput) => any, keepOpen: boolean = false) {
  return createDuplex<any, any>((input, output) => {
    const nextInput = () => {
      input.next().then(({value}) => {
        if (value == null) {
          if (!keepOpen) {
            return output.return();
          }
        }
        return pump(wrapAsyncIterableIterator(fn(value)), (value) => {
          return output.unshift(value);
        }).then(nextInput);
      });
    };

    nextInput();
  });
}