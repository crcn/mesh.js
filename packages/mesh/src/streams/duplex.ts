
import { readAllChunks } from "./utils";

export type ReadableStream<T> = () => AsyncIterableIterator<T>;
export type WritableStream<T> = (value: T) => AsyncIterableIterator<any>;
export type DuplexStream<T, U> = [ReadableStream<T>, WritableStream<U>];

export function wrapDuplexStream<T, U>(value): DuplexStream<T, U> {
  if (Array.isArray(value) && typeof value[0] === "function" && typeof value[1] === "function") {
    return value as [ReadableStream<T>, WritableStream<U>];
  }

  if (value && value.next) {
    return [
      async function *() {}, 
      async function *() {}
    ];
  }

  return [
    async function*() {
      if (Array.isArray(value)) {
        for (const item of value) {
          yield item;
        }
      }
      yield value;
    },
    async function *() {}
  ]
}

export const createDuplexStream = <T, U>(handler: (readChunk: () => any) => any) => {

  async function* write() {

  }

  // const output = handler()

  async function* read() {
    
  }


  return [read, write];
}
