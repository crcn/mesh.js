import { ReadableStream, ReadableStreamDefaultReader, TransformStream, IChunkReadResult } from "./std";
export declare function readAllChunks<T>({readable, writable}: TransformStream<any, T>): Promise<T[]>;
export declare function readAllChunks<T>(readable: ReadableStream<T>): Promise<T[]>;
export declare function readOneChunk<T>({readable, writable}: TransformStream<any, T>): Promise<IChunkReadResult<T>>;
export declare function readOneChunk<T>(readable: ReadableStream<T>): Promise<IChunkReadResult<T>>;
/**
 * await pump(stream, this.onChunk)
 */
export declare const pump: (reader: ReadableStreamDefaultReader<any>, each: (value: any) => any, eachError?: (error: any) => boolean | void) => Promise<{}>;
