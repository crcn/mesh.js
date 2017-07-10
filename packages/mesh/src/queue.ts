export interface Queue<T> extends AsyncIterableIterator<T> {
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
    return new Promise((resolve, reject) => {
      if (_pulling.length) {
        _pulling.shift()[0]({ value, done });
        resolve();
      } else {
        _pushing.push(() => {
          resolve();
          return Promise.resolve({ value, done });
        });
      }
    });
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