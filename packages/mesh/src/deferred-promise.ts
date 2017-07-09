
export interface DeferredPromise<T> {
  resolve: (result: T) => any;
  reject: (result?: any) => any;
  promise: Promise<T>;
}

export const createDeferredPromise = <T>(): DeferredPromise<T> => {
  let resolve;
  let reject;
  let promise: Promise<T>;

  promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject  = _reject;
  });
  
  return {
    promise,
    resolve,
    reject,
  }
}
