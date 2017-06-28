import { 
  DuplexStream, 
  isDuplexStream,
  ReadableStream, 
  WritableStream 
} from "./duplex";

/*

// infinite
const [read, write] = createDuplexStream(async function*(read) {
  for async (const value of read()) {
    yield value.toUpperCase();
  }
}); 

write('a', 'b', 'c');

for (const )

*/

// pipe(async function*() => yield 1, duplex)

export function readAll<T>([ reader, writer ]: DuplexStream<any, T>): Promise<T[]>;
export function readAll<T>(reader: ReadableStream<T>): Promise<T[]>;
export function readAll<T>(value: any): Promise<T[]> {

  let read: ReadableStream<T> = isDuplexStream(value) ? value[0] : value;

  return new Promise((resolve, reject) => {
    const result = [];
    pump(read, (chunk) => {
      result.push(chunk);
    }).then(resolve.bind(this, result)).catch(reject);
  });
}

/**
 * await pump(stream, this.onChunk)
 */

export const pump = async function(read: ReadableStream<any>, each: (value: any) => any) {
  for await (const value of read()) {
    await each(value);
  }
}

/**
 * await pump(stream, this.onChunk)
 */

export const mutex = async function<T, U>(): DuplexStream<T, U> {
  [
    async function* read(): T {

    },
    async function* write(value?: U) {

    }
  ]
}

/**
 */

export const tee = <T>(read: ReadableStream<T>): ReadableStream<T> => {

  let _current: Promise<any>;
  let buffer: T[] = [];
  let running: boolean;
  let done: Promise<boolean>;

  const start = function() {
    if (running) return;
    running = true;
    const _run = read();
    const pump = () => {
      done = _run.next().then(chunk => {
        if (chunk.done) return true;
        buffer.push(chunk.value);
        return false;
      });

      done.then((done) => !done && pump());
    }

    pump();
  }

  return () => {
    start();
    return (async function*()  {
      let i = buffer.length;
      yield* buffer;
      let curr: IteratorResult<T>;
      while(!(await done)) {
        yield* buffer.slice(i, buffer.length);
        i = buffer.length;
      }
    })();
  };
}