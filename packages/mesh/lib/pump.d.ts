export declare function pump<TOutput>(stream: Iterable<TOutput>, each: (value: TOutput) => any): any;
export declare function pump<TOutput>(stream: AsyncIterable<TOutput>, each: (value: TOutput) => any): any;
export declare function pump<TOutput>(stream: IterableIterator<TOutput>, each: (value: TOutput) => any): any;
export declare function pump<TOutput>(stream: AsyncIterableIterator<TOutput>, each: (value: TOutput) => any): any;
