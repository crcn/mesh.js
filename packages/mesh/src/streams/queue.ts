interface Queue<T> extends AsyncIterableIterator<T> {
  unshift(value: T);
  done(returnValue?: T);
}

export const createQueue = <T>(): Queue<T> => {
  const _buffer: T[] = [];
  const _pulling: Array<[(r: IteratorResult<T>) => any, (r: any) => any]> = [];
  const _pushing = [];

  const write = (value: T, done = false) => {
    return (_pulling.shift() || [((chunk) => new Promise((resolve) => {
        _pushing.push(() => {
          resolve(); 
          return chunk;
        });
      })
    ), null])[0]({ value, done });
  };

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next(value: T): Promise<IteratorResult<T>> {
      if (_pushing.length) {
        return _pushing.shift()();
      }
      return new Promise<IteratorResult<T>>((resolve, reject) => {
        _pulling.push([resolve, reject]);
      });
    },
    unshift(value: T) {
      return write(value);
    },
    done(returnValue) {
      return write(returnValue, true);
    }
  }
};