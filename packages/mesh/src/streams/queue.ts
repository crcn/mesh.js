

export const createQueue = <T>(): [((value: T) => Promise<any>), () => Promise<T>] => {
  const _buffer: T[] = [];
  const _pulling = [];
  const _pushing = [];
  return [
    async function push(value: T) {
      return (_pulling.shift() || (() => { 
        const p = new Promise((resolve) => {
          _pushing.push(() => {
            resolve(); 
            return value;
          });
        });
        return p;
      }))(value);
    },
    async function shift(): Promise<T> {
      if (_pushing.length) {
        return _pushing.shift()();
      }
      return new Promise<T>((resolve, reject) => {
        _pulling.push(resolve);
        // _reject = reject;
      });
    }
  ]
};