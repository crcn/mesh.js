export declare class ReadableByteStreamController<T> {
  constructor(
    stream: ReadableStream<T>,
    underlyingByteSource: Source<T>,
    highWaterMark: number
  );
  readonly byobRequest: any;
  readonly desiredSize: number;
  close(): void;
  enqueue(chunk: T): void;
  error(error: any): void;
}

export declare class ReadableStreamDefaultController<T> {
  constructor(
    stream: ReadableStream<T>,
    underlyingSource: Source<T>,
    size: ((chunk: T) => number) | undefined,
    highWaterMark: number
  );
  readonly desiredSize: number;
  close(): void;
  enqueue(chunk: T): void;
  error(error: any): void;
}

export type ReadableStreamController<T> =
  ReadableStreamDefaultController<T> | ReadableByteStreamController<T>;

export interface IChunkReadResult<T> {
  value: T;
  done?: boolean;
}

export interface ReadableStreamDefaultReader<T> {
  // constructor(stream)
  readonly closed: Promise<void>;
  cancel(reason: any): Promise<void>;
  read(): Promise<IChunkReadResult<T>>;
  releaseLock(): void;
}

export interface ReadableStreamBYOBReader<T> {
  readonly closed: Promise<void>;
  cancel(reason: any): Promise<void>;
  read(view: any): Promise<IChunkReadResult<T>>; // ArrayBuffer.isView(view) === true && view.byteLength > 0
  releaseLock(): void;
}

export type ReadableStreamReader<T> =
  ReadableStreamDefaultReader<T>;

export interface Source<T> {
  type?: 'bytes' | undefined;
  start?(controller: ReadableStreamController<T>): Promise<any> | any | void;
  pull?(controller: ReadableStreamController<T>): Promise<any> | any | void;
  cancel?(reason: any): Promise<any> | any | void;
}

export interface QueuingStrategy<T> {
  size?: (chunk: T) => number;
  readonly highWaterMark?: number;
}

export declare class ByteLengthQueuingStrategy<
  T extends { byteLength: number; }
  >
  implements QueuingStrategy<T> {
  constructor({ highWaterMark }: { highWaterMark: number; });
  size: (chunk: { byteLength: number; }) => number;
  readonly highWaterMark: number;
}

export declare class CountQueuingStrategy<T>
  implements QueuingStrategy<T> {
  constructor({ highWaterMark }: { highWaterMark: number; });
  size: (chunk: T) => number;
  readonly highWaterMark: number;
}

export declare class ReadableStream<T> {
  constructor(
    underlyingSource?: Source<T>,
    options?: QueuingStrategy<T>
  );
  readonly locked: boolean;
  cancel(reason: any): Promise<void>;
  getReader(options?: { mode?: string; }): ReadableStreamReader<T>;
  pipeThrough<U>(
    transform: { writable: WritableStream<T>; readable: ReadableStream<U>; },
    options?: {
      preventClose?: boolean;
      preventAbort?: boolean;
      preventCancel?: boolean;
    }
  ): ReadableStream<U>;
  pipeTo(
    dest: WritableStream<T>,
    options?: {
      preventClose?: boolean;
      preventAbort?: boolean;
      preventCancel?: boolean;
    }
  ): Promise<void>;
  tee(): [ReadableStream<T>, ReadableStream<T>];
}

export interface WritableStreamDefaultWriter<T> {
  // constructor(stream)
  readonly closed: Promise<void>;
  readonly desiredSize: number;
  readonly ready: Promise<void>;

  abort(reason: any): Promise<void>;
  close(): Promise<any>;
  releaseLock(): void;
  write(chunk: T): Promise<any>;
}

export interface TransformStreamDefaultController<T> {
  enqueue(chunk: T): void;
  close(): void;
  error(reason: any): void;
}

export type TransformStreamController<T> =
  TransformStreamDefaultController<T>;

export class TransformStream<T, U> {
  constructor(transformer: {
    start?(controller: TransformStreamController<U>): any,
    transform?(
      chunk: T,
      controller: TransformStreamController<U>
    ): any,
    flush?(
      controller: TransformStreamController<U>
    ): any
  });
  readable: ReadableStream<U>;
  writable: WritableStream<T>;
}

export declare class WritableStreamDefaultController<T> {
  constructor(
    stream: WritableStream<T>,
    underlyingSink: Sink<T>,
    size: ((chunk: T) => number) | undefined,
    highWaterMark: number
  );
  error(error: any): void;
}

export type WritableStreamController<T> =
  WritableStreamDefaultController<T>;

export interface Sink<T> {
  start?(controller: WritableStreamController<T>): Promise<any> | any | void;
  write?(chunk: T): Promise<any> | any | void;
  close?(): Promise<any> | any | void;
  abort?(reason: any): Promise<any> | any | void;
}

export declare class WritableStream<T> {
  constructor(underlyingSink?: Sink<T>);
  // constructor(underlyingSink = {}, { size, highWaterMark = 1 } = {})
  readonly locked: boolean;
  abort(reason: any): Promise<any>;
  getWriter(): WritableStreamDefaultWriter<T>;
}
