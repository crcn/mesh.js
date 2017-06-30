
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

// export const transform = <TInput, TOutput>(source: AsyncIterableIterator<TInput>, map: (value: TInput) => AsyncIterableIterator<TOutput>): AsyncIterableIterator<TOutput> => ({
//   [Symbol.asyncIterator]: function() { return this; },
//   next: async (value?: TInput) => target.next((await source.next(value)).value),
//   return: async (value?: TInput) => target.return(await source.return(value)),
//   throw: async (e?: any) => target.throw(await source.throw(e))
// });


export const pipe = <TInput, TOutput>(...pipeline: AsyncIterableIterator<any>[]) => {

  const call = (methodName: string, value) => {
    return new Promise((resolve, reject) => {
      const remaining = pipeline.concat();
      const next = ({ value }) => {
        if (!remaining.length) return resolve({value});
        const fn = remaining.shift()[methodName];
        return fn ? fn(value).then(next, reject) : next(value);
      }
      next({ value });
    });
  };

  return {
    [Symbol.asyncIterator]: () => this,
    next: call.bind(this, "next"),
    return: call.bind(this, "return"),
    throw: call.bind(this, "throw")
  };
}

export function through<TInput, TOutput>(fn: (input: TInput) => TOutput, maxCalls?: number): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => IterableIterator<TOutput>, maxCalls?: number): AsyncIterableIterator<TOutput>;
export function through<TInput, TOutput>(fn: (input: TInput) => AsyncIterableIterator<TOutput>, maxCalls?: number): AsyncIterableIterator<TOutput>;

export function through<TInput>(fn: (input: TInput) => any, maxCalls: number = Infinity) {
  let current: AsyncIterableIterator<TInput>;
  const queue: TInput[] = [];

  function next(value?: TInput) {
    if (arguments.length === 1) {
      queue.push(value);
    }

    if (!current) {
      current = wrapAsyncIterableIterator(fn(queue.shift()));
      return next();
    }

    return new Promise((resolve, reject) => {
      current.next().then((result) => {
        if (result.done) {
          if (--maxCalls > 0) {
            current = undefined;
            return next().then(resolve, reject);
          } else {
            return resolve(result);
          }
        } else {
          resolve(result);
        }
      }, reject);
    })
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
      }, reject);
    };
  });
}

export function wrapAsyncIterableIterator<TInput, TOutput>(source: any): AsyncIterableIterator<TOutput> {
  if (source != null && typeof source === "object") {
    if (source[Symbol.asyncIterator]) {
      return source;
    }
    if (source[Symbol.iterator]) {
      return {
        [Symbol.asyncIterator]: function() {
          return this;
        },
        next(value?: TInput) {
          return Promise.resolve((<IterableIterator<TOutput>>source).next(value));
        },
        return: source.return ? (value?: TOutput) => {
          return Promise.resolve((<IterableIterator<TOutput>>source).return(value));
        } : null,
        throw: source.throw ? (error: any) => {
          return Promise.resolve((<IterableIterator<TOutput>>source).throw(error));
        } : null
      }
    }
  }

  let nexted = false;
  return {
    [Symbol.asyncIterator]: function() {
      return this;
    },
    next: () => {
      if (nexted) return Promise.resolve({ value: undefined, done: true });
      nexted = true;
      return Promise.resolve({ value: source, done: false });
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

/**
 */

export const tee = <T>(read: ReadableStream<T>): ReadableStream<T> => {

  let _current: Promise<any>;
  let buffer: T[] = [];
  let running: boolean;
  let done: Promise<boolean>;

  const start = function() {
    if (running) return;
    running = true;
    const _run = read();
    const pump = () => {
      done = _run.next().then(chunk => {
        if (chunk.done) return true;
        buffer.push(chunk.value);
        return false;
      });

      done.then((done) => !done && pump());
    }

    pump();
  }

  return () => {
    start();
    return (async function*()  {
      let i = buffer.length;
      yield* buffer;
      let curr: IteratorResult<T>;
      while(!(await done)) {
        yield* buffer.slice(i, buffer.length);
        i = buffer.length;
      }
    })();
  };
}