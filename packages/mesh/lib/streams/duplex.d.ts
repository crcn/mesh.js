import { ReadableStream, WritableStream, TransformStream } from "./std";
export declare type DuplexStreamResponse = {
    close(reason?): any;
};
export declare type DuplexStreamHandler<T, U> = (input: ReadableStream<T>, output: WritableStream<U>) => any | DuplexStreamResponse;
export declare class ChunkQueue<T> {
    private _reads;
    private _writes;
    push(value: T): Promise<any>;
    readonly size: number;
    shift(): Promise<{}>;
    cancel(reason: any): void;
}
export declare function wrapDuplexStream<T, U>(value: any): TransformStream<T, U>;
export declare class DuplexStream<T, U> implements TransformStream<T, U> {
    private _input;
    private _output;
    $response: DuplexStreamResponse;
    constructor(handler: DuplexStreamHandler<T, U>);
    static empty(): DuplexStream<{}, {}>;
    static fromArray(items: any[]): DuplexStream<{}, {}>;
    then(resolve?: any, reject?: any): Promise<U[]>;
    readonly writable: WritableStream<T>;
    readonly readable: ReadableStream<U>;
}
export declare const createDuplexStream: <T, U>(handler: DuplexStreamHandler<T, U>) => DuplexStream<T, U>;
