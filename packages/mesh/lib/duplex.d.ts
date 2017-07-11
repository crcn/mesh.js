import { Queue } from "./queue";
export interface DuplexAsyncIterableIterator<TInput, UOutput> extends AsyncIterableIterator<UOutput> {
    next(input?: TInput): Promise<IteratorResult<UOutput>>;
}
export declare const createDuplex: <TInput, TOutput>(handler: (input: Queue<TInput>, output: Queue<TOutput>) => any) => DuplexAsyncIterableIterator<TInput, TOutput>;
