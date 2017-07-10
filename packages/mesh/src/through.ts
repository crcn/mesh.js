import { pump } from "./pump";
import { createQueue } from "./queue";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";

export function through<TInput, TOutput>(fn: (input: TInput) => TOutput, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => IterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => AsyncIterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;

// TODO - possibly endOnNoInput
export function through<TInput>(fn: (input: TInput) => any, keepOpen: boolean = false) {
  let _running: boolean;
  let _pumping: boolean;
  const outputQueue = createQueue();
  const inputQueue  = createQueue<TInput>();

  const run = () => {
    if (_running) {
      return;
    }
    _running = true;

    const nextInput = () => {
      inputQueue.next().then(({value}) => {
        _pumping = true;
        return pump(wrapAsyncIterableIterator(fn(value)), (value) => {
          return outputQueue.unshift(value);
        }).then(() => {
          _pumping = false;
          nextInput();
        });
      });
    };

    nextInput();
  }

  function next(value?: TInput) {
    if (value != null) {
      run();
      inputQueue.unshift(value);
    } else if (!keepOpen) {
      Promise.resolve().then(() => {
        if (!_pumping) {
          outputQueue.return();
        }
      });
    }

    return outputQueue.next();
  }

  return {
    [Symbol.asyncIterator]: () => this,
    next: next
  };
}