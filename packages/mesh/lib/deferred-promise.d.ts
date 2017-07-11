export interface DeferredPromise<T> {
    resolve: (result: T) => any;
    reject: (result?: any) => any;
    promise: Promise<T>;
}
export declare const createDeferredPromise: <T>() => DeferredPromise<T>;
