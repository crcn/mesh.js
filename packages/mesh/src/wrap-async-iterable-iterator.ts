const noReturn = (value?: any) => Promise.resolve({ value: undefined, done: true });
const noThrow  = noReturn;

export function wrapAsyncIterableIterator<TInput, TOutput>(source: any): AsyncIterableIterator<TOutput> {
  if (source != null && typeof source === "object") {
    if (source[Symbol.asyncIterator]) {
      return {
        [Symbol.asyncIterator]: () => this,
        next: source.next,
        return: source.return ? source.return : noReturn,
        throw: source.throw ? source.throw : noThrow
      };
    }

    if (source[Symbol.iterator]) {
      const iterator = source[Symbol.iterator]();
      return {
        [Symbol.asyncIterator]: function() {
          return this;
        },
        next(value?: TInput) {
          let v;
          try {
            v = (<IterableIterator<TOutput>>iterator).next(value);
          } catch(e) {
            return Promise.reject(e);
          }
          return Promise.resolve(v);
        },
        return: source.return ? (value?: TOutput) => {
          return Promise.resolve((<IterableIterator<TOutput>>iterator).return(value));
        } : noReturn,
        throw: source.throw ? (error: any) => {
          return Promise.reject((<IterableIterator<TOutput>>iterator).throw(error));
        } : noThrow
      }
    }
  }

  let result: Promise<IteratorResult<TOutput>> = typeof source === "object" && source != null && !!source.then ? source.then(result => Promise.resolve({ value: result, done: false })) : Promise.resolve({ value: source, done: source == null });

  let nexted = false;
  return {
    [Symbol.asyncIterator]: function() {
      return this;
    },
    next: () => {
      if (nexted) return Promise.resolve({ value: undefined, done: true });
      nexted = true;
      return result;
    },
    return: () => Promise.resolve({ value: undefined, done: true }),
    throw: (e) => Promise.reject(e)
  }
}