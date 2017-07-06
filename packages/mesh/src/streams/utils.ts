interface Queue<T> extends AsyncIterableIterator<T> {
  unshift(value: T);
  done(returnValue?: T);
  error(e: any);
  readonly pushingCount: number;
  readonly pullingCount: number;
  readonly isPushing: boolean;
}

export const createQueue = <T>(): Queue<T> => {
  const _pulling: Array<[(r: IteratorResult<T>) => any, (r: any) => any]> = [];
  const _pushing = [];
  let _e: any;
  let _done: boolean;
  let _isPushing: boolean;

  const write = (value: T, done = false) => {
    _isPushing = true;
    return new Promise((resolve, reject) => {
      if (_pulling.length) {
        _pulling.shift()[0]({ value, done });
        _isPushing = false;
        resolve();
      } else {
        _pushing.push(() => {
          resolve();
          _isPushing = _pushing.length === 0;
          return Promise.resolve({ value, done });
        });
      }
    });
  };

  return {
    get isPushing() {
      return _isPushing;
    },
    get pushingCount() {
      return _pushing.length;
    },
    get pullingCount() {
      return _pulling.length;
    },
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
      if (_done) {
        return Promise.resolve();
      }
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

export const createDeferredPromise = <T>() => {
  let resolve;
  let reject;
  let promise: Promise<T>;

  promise = new Promise((resolve, reject) => {
    resolve = resolve;
    reject = reject;
  });
  
  return {
    promise,
    resolve,
    reject,
  }
}

export interface DuplexStream<TInput, UOutput> extends AsyncIterableIterator<UOutput> {
  next(input?: TInput): Promise<IteratorResult<UOutput>>;
}

export const createDuplexStream = <TInput, TOutput>(): DuplexStream<TInput, TOutput> & { input: Queue<TInput>, output: Queue<TOutput> } => {
  const input  = createQueue<TInput>();
  const output = createQueue<TOutput>();

  return {
    [Symbol.asyncIterator]: () => this,
    input,
    output,
    next(value: TInput) {
      input.unshift(value);
      return output.next();
    }
  };
}

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
          outputQueue.done();
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
        wrapPromise(each(value)).then(next);
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

export function wrapPromise<TValue>(value: TValue | Promise<TValue>): Promise<TValue> {
  if (value && value["then"]) return value as Promise<TValue>;
  return Promise.resolve(value);
}


/*
1. need to be able to abort stream from dispatched

for await (const value of read()) {
  break; // break to abort
}

const dispatch = (message: Message) => (value: string) => 
*/
