interface Queue<T> extends AsyncIterableIterator<T> {
  unshift(value: T);
  done(returnValue?: T);
  error(e: any);
}

export const createQueue = <T>(): Queue<T> => {
  const _pulling: Array<[(r: IteratorResult<T>) => any, (r: any) => any]> = [];
  const _pushing = [];
  let _e: any;
  let _done: boolean;

  const write = (value: T, done = false) => {
    return (_pulling.shift() || [((chunk) => new Promise((resolve) => {
        _pushing.push(() => {
          resolve(); 
          return Promise.resolve(chunk);
        });
      })
    ), null])[0]({ value, done });
  };

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next(value: T): Promise<IteratorResult<T>> {
      if (_e) {
        return Promise.reject(_e);
      }
      if (_pushing.length) {
        return _pushing.shift()();
      }
      if (_done) {
        return Promise.resolve({ done: true });
      }
      return new Promise<IteratorResult<T>>((resolve, reject) => {
        _pulling.push([resolve, reject]);
      });
    },
    unshift(value: T) {
      return write(value);
    },
    done(returnValue) {
      _done = true;
      return write(returnValue, true);
    },
    error(e) {
      _e = e;
      if (_pulling.length) {
        _pulling.shift()[1](e);
      }
    }
  }
};

export interface DuplexStream<TInput, UOutput> extends AsyncIterableIterator<UOutput> {
  next(input?: TInput): Promise<IteratorResult<UOutput>>;
}

export const createDuplexStream = <TInput, UOutput>(handler: () => DuplexStream<TInput, UOutput>) => {
  let handlerIterator;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(input: TInput) {
      if (!handlerIterator) {
        handlerIterator = handler();
        await handlerIterator.next();
        return await handlerIterator.next(input);
      }
    }
  }
};

export const wrapDuplexStream = <T, U>(value): DuplexStream<T, U> => typeof value === 'function' ? value : () => value[Symbol.asyncIterator] || value[Symbol.iterator] ? () => value : () => ({
  [Symbol.asyncIterator]: () => this,
  next: () => Promise.resolve(value)
});


// pipe(async function*() => yield 1, duplex)

export function readAll<T>(stream: DuplexStream<any, T>): Promise<T[]>;
export function readAll<T>(stream: AsyncIterableIterator<T>): Promise<T[]>;

export function readAll<T>(source: any): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const result = [];
    pump(source, (chunk) => result.push(chunk)).then(resolve.bind(this, result)).catch(reject);
  });
}

export function pipe(...pipeline: any[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: IterableIterator<any>[]): AsyncIterableIterator<any>;
export function pipe(...pipeline: AsyncIterableIterator<any>[]): AsyncIterableIterator<any>;

export function pipe<TInput, TOutput>(...pipeline: any[]) {

  let _done = false;

  const targets = pipeline.map(wrapAsyncIterableIterator);

  const call = (methodName: string, value: TInput) => {
    return new Promise((resolve, reject) => {
      const remaining = targets.concat();
      const next = ({ value, done }) => {

        if (!_done) {
          _done = done;
        }

        // if one piped item finishes, then we need to finish
        if (!remaining.length || _done) return resolve({value, done});
        const fn = remaining.shift()[methodName];
        return fn ? fn(value).then(next, reject) : next(value);
      }
      next({ value, done: false });
    });
  };

  return {
    [Symbol.asyncIterator]: () => this,
    next: call.bind(this, "next"),
    return: call.bind(this, "return"),
    throw: call.bind(this, "throw")
  };
}

export function through<TInput, TOutput>(fn: (input: TInput) => TOutput, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => IterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => AsyncIterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;

// TODO - possibly endOnNoInput
export function through<TInput>(fn: (input: TInput) => any, keepOpen: boolean = false) {
  let current: AsyncIterableIterator<TInput>;
  const queue: TInput[] = [];
  let _inputListeners: Array<(v) => any> = [];
  let _inputPromise: Promise<any>;
  let _done: boolean;
  const outputQueue = createQueue();

  function next(value?: TInput) {
    if (value != null) {
      queue.push(value);
    }

    if (!current && !_done && queue.length) {
      console.log('MAKING NEW CURRENT', queue[0]);
      current = wrapAsyncIterableIterator(fn(queue.shift()));
      // return next();
      // if (queue.length) {
      // } else if (keepOpen) {
      //   return new Promise((resolve) => {
      //     const listener = (v) => {
      //       _inputListeners.splice(_inputListeners.indexOf(listener), 1);
      //       resolve(v);
      //     }
      //     _inputListeners.push(listener);
      //   });
      // } else {
      //   return Promise.resolve({ done: true });
      // }
    }

    if (current) {
      console.log('NEXTING');
      return current.next().then((result) => {
        console.log(result, keepOpen, queue.length);
        if (result.done) {
          current = undefined;
          if (queue.length) {
            return next();
          } else if (!keepOpen) {
            _done = true;
            outputQueue.done(result.value);
          } else {
            console.log('WAITING FOR NEWXT INPUT');
          }
        } else {
          console.log('UNSHIFTING');
          outputQueue.unshift(result.value);
        }

        return outputQueue.next();
      }); 
    }

    return outputQueue.next();
    // return new Promise((resolve, reject) => {
    //   current.next().then((result) => {
    //     console.log(result);
    //     if (result.done) {
    //       console.log('SET TO UNDEFINED');
    //       current = undefined;
    //       return next().then(resolve, reject);
    //     } else {
    //       for (const listener of _inputListeners) {
    //         listener(result);
    //       }
    //       resolve(result);
    //     }
    //   }, reject);
    // })
  };

  return {
    [Symbol.asyncIterator]: () => this,
    next: next
  };
}

/**
 * await pump(stream, this.onChunk)
 */

export function pump<TOutput>(stream: IterableIterator<TOutput>, each: (value: TOutput) => any);
export function pump<TOutput>(stream: AsyncIterableIterator<TOutput>, each: (value: TOutput) => any);

export function pump<TOutput>(source: any, each: (value: TOutput) => any) {
  return new Promise((resolve, reject) => {
    const iterable = wrapAsyncIterableIterator<any, TOutput>(source);
    const next = () => {
      iterable.next().then(({ value, done }) => {
        if (done) return resolve();
        each(value);
        next();
      }, reject);
    };
    next();
  });
}

export function wrapAsyncIterableIterator<TInput, TOutput>(source: any): AsyncIterableIterator<TOutput> {
  if (source != null && typeof source === "object") {
    if (source[Symbol.asyncIterator]) {
      return source;
    }

    if (source[Symbol.iterator]) {
      const iterator = source[Symbol.iterator]();
      return {
        [Symbol.asyncIterator]: function() {
          return this;
        },
        next(value?: TInput) {
          const v = (<IterableIterator<TOutput>>iterator).next(value);
          return Promise.resolve(v);
        },
        return: source.return ? (value?: TOutput) => {
          return Promise.resolve((<IterableIterator<TOutput>>iterator).return(value));
        } : null,
        throw: source.throw ? (error: any) => {
          return Promise.resolve((<IterableIterator<TOutput>>iterator).throw(error));
        } : null
      }
    }
  }

  let result: Promise<IteratorResult<TOutput>> = typeof source === "object" && source != null && !!source.then ? source.then(result => Promise.resolve({ value: result, done: false })) : Promise.resolve({ value: source, done: false });

  let nexted = false;
  return {
    [Symbol.asyncIterator]: function() {
      return this;
    },
    next: () => {
      if (nexted) return Promise.resolve({ value: undefined, done: true });
      nexted = true;
      return result;
    }
  }
}

/*
1. need to be able to abort stream from dispatched

for await (const value of read()) {
  break; // break to abort
}

const dispatch = (message: Message) => (value: string) => 
*/
