import { createQueue, Queue } from "./queue";
import { } from "./pump";

export const tee = (source: AsyncIterableIterator<any>): [AsyncIterableIterator<any>, AsyncIterableIterator<any>] => {

  const inputs: Queue<any>[] = [];
  let _running: boolean;

  const start = () => {
    if (_running) {
      return;
    }
    _running = true;

    const next = () => {
      source.next().then(({ value, done }) => {
        for (const input of inputs) {
          if (done) {
            input.done();
          } else {
            input.unshift(value);
          }
        }
        if (!done) {
          next();
        }
      });
    };
    next();
  }
  
  const createSpare = () => {
    const input = createQueue();
    inputs.push(input);
    
    return {
      [Symbol.asyncIterator]: () => this,
      next(value) {
        start();
        return input.next();
      }
    }
  }

  return [
    createSpare(),
    createSpare()
  ];
};