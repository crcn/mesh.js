
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
    }
  }
}