export declare function through<TInput, TOutput>(fn: (input: TInput) => TOutput, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export declare function through<TInput, TOutput>(fn: (input: TInput) => IterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
export declare function through<TInput, TOutput>(fn: (input: TInput) => AsyncIterableIterator<TOutput>, keepOpen?: boolean): AsyncIterableIterator<TOutput>;
