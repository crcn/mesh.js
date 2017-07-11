/**
 * Creates a new messaging channel over an existing message stream.
 */
export declare const channel: (channel: AsyncIterableIterator<any>, call: Function, info?: any) => (...args: any[]) => void;
