import { DuplexStream } from "./duplex-stream";
import { pump } from "./pump";

export function readAll<T>(stream: DuplexStream<any, T>): Promise<T[]>;
export function readAll<T>(stream: AsyncIterableIterator<T>): Promise<T[]>;

export function readAll<T>(source: any): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const result = [];
    pump(source, (chunk) => result.push(chunk)).then(resolve.bind(this, result)).catch(reject);
  });
}