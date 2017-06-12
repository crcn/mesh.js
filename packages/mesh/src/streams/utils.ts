import { ReadableStream, ReadableStreamDefaultReader, WritableStream, TransformStream, IChunkReadResult } from "./std";

export function readAllChunks<T>({ readable, writable }: TransformStream<any, T>): Promise<T[]>;
export function readAllChunks<T>(readable: ReadableStream<T>): Promise<T[]>;
export function readAllChunks<T>(value: any): Promise<T[]> {

  let readable: ReadableStream<T> = (<TransformStream<any, T>>value).readable || value as ReadableStream<T>;

  return new Promise((resolve, reject) => {
    const result = [];
    readable.pipeTo(new WritableStream({
      write(chunk) {
        result.push(chunk);
      }
    })).then(resolve.bind(this, result)).catch(reject);
  });
}
export function readOneChunk<T>({ readable, writable }: TransformStream<any, T>): Promise<IChunkReadResult<T>>;
export function readOneChunk<T>(readable: ReadableStream<T>): Promise<IChunkReadResult<T>>;
export async function readOneChunk<T>(value: any): Promise<IChunkReadResult<T>> {
  let readable: ReadableStream<T> = (<TransformStream<any, T>>value).readable || value as ReadableStream<T>;
  return await readable.getReader().read();
}

/**
 * await pump(stream, this.onChunk)
 */

export const pump = async (reader: ReadableStreamDefaultReader<any>, each: (value: any) => any, eachError?: (error: any) => boolean|void) => {

  if (!eachError) {
    eachError = () => false
  }

  let value, done;
  return new Promise((resolve, reject) => {
    const next = () => {
      reader.read().then(({ value, done }) => {
        if (done) {
          resolve();
        } else {          
          each(value);
          next();
        }
      }, (error) => {
        if (eachError(error) === false) return reject(error);
        next();
      });
    };

    next();
  })
}