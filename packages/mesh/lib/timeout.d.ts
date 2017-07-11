export declare const timeout: (fn: Function, ms?: number, createError?: (...args: any[]) => Error) => (...args: any[]) => {
    [Symbol.asyncIterator]: () => any;
    next(value?: any): Promise<any>;
};
