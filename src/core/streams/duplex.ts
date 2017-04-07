import {
  ReadableStream,
  WritableStream,
  TransformStream,
  ReadableStreamDefaultController,
  WritableStreamDefaultController,
} from "./std";

import { readAllChunks } from "./utils";

export type DuplexStreamResponse = { close(reason?): any };
export type DuplexStreamHandler<T, U> = (input: ReadableStream<T>, output: WritableStream<U>) => any | DuplexStreamResponse;

export class ChunkQueue<T> {

  private _reads: Array<(value:T) => any> = [];
  private _writes: Array<[T, () => any, (reason: any) => any]> = [];

  push(value: T): Promise<any> {

    if (this._reads.length) {
      this._reads.shift()(value);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this._writes.push([value, resolve, reject]);
    });
  }

  get size() {
    return this._writes.length;
  }

  shift() {
    if (this._writes.length) {
      const [value, resolve] = this._writes.shift();
      resolve();
      return Promise.resolve(value);
    }
    return new Promise((resolve) => {
      this._reads.push(resolve);
    });
  }

  cancel(reason) {
    const writes = this._writes.concat();
    this._writes = [];
    for (const [value, resolve, reject] of writes) {
      reject(reason);
    }
  }
}

class ReadableWritableStream<T> {

  readonly writable: WritableStream<T>;
  readonly readable: ReadableStream<T>

  constructor(stream: DuplexStream<any, any>) {
    let readerController: ReadableStreamDefaultController<T>;
    let writerController: WritableStreamDefaultController<T>;
    let cancelReason: any;
    let abortReason: any;
    let _writePromise: Promise<any> = Promise.resolve();

    const queue = new ChunkQueue<T>();

    const close = (reason) => {
      queue.cancel(reason);
      if (stream.$response.close) {
        stream.$response.close(reason);
      }
    }

    const output = this.readable = new ReadableStream<T>({
      start(controller) {
        readerController = controller;
      },
      pull(controller) {
        return queue.shift().then((value) => {
          readerController.enqueue(value as T);
        });
      },
      cancel(reason) {
        cancelReason = reason;
        close(reason);
      }
    });

    let inputAborted: boolean;

    const input = this.writable = new WritableStream<T>({
      start(controller) {
        writerController = controller;
      },
      write: (chunk) => {
        // need to eat the chunk here. Streams will re-throw
        // any exception that are occur in in sink.write()
        if (cancelReason) return;
        return _writePromise = queue.push(chunk);
      },
      close() {
        if (cancelReason) return;

        const close = () => {
          readerController.close();
        }

        return _writePromise.then(close, close);
      },
      abort(reason) {
        if (cancelReason) return;
        abortReason = reason;
        readerController.error(reason);
        close(reason);
      }
    });
  }
}

export function wrapDuplexStream<T, U>(value): TransformStream<T, U> {
  if (value && value.readable && value.writable) {
    if (value.writable) {
      return value;
    }
  }

  if (value instanceof ReadableStream) {
    const readable: ReadableStream<T> = value;
    return new TransformStream({
      start(controller) {
        readable.pipeTo(new WritableStream({
          write(chunk) {
            controller.enqueue(chunk);
          },
          abort(error) {
            controller.error(error);
          },
          close() {
            controller.close();
          }
        }))
      }
    })
  }

  return new TransformStream({
    async start(controller) {
      const v = await value;
      if (v != null) {
        if (Array.isArray(v)) {
          v.forEach((i) => controller.enqueue(i));
        } else {
          controller.enqueue(v);          
        }
      }
      controller.close();
    }
  });
}

export class DuplexStream<T, U> implements TransformStream<T, U> {

  private _input: ReadableWritableStream<T>;
  private _output: ReadableWritableStream<U>;
  public $response: DuplexStreamResponse;

  constructor(handler: DuplexStreamHandler<T, U>) {
    const input  = this._input  = new ReadableWritableStream(this);
    const output = this._output = new ReadableWritableStream(this);
    this.$response = handler(input.readable, output.writable) || {};
  }

  static empty() {
    return new DuplexStream((input, output) => {
      output.getWriter().close();
    });
  }

  static fromArray(items: any[]) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      items.forEach(item => writer.write(item));
      writer.close();
    });
  }

  then(resolve?, reject?) {
    return readAllChunks(this).then(resolve, reject);
  }

  get writable(): WritableStream<T> {
    return this._input.writable;
  }

  get readable(): ReadableStream<U> {
    return this._output.readable;
  }
}

export const createDuplexStream = <T, U>(handler: DuplexStreamHandler<T, U>) => new DuplexStream(handler);
