import { DuplexAsyncIterableIterator } from "./duplex";
export declare function readAll<T>(stream: DuplexAsyncIterableIterator<any, T>): Promise<T[]>;
export declare function readAll<T>(stream: AsyncIterableIterator<T>): Promise<T[]>;
