export declare type IteratorType<T> = (items: T[], each: (value: T) => Promise<any>) => Promise<any>;
export declare const sequenceIterator: <T>(items: T[], each: (value: T) => Promise<any>) => Promise<{}>;
export declare const parallelIterator: <T>(items: T[], each: (value: T) => Promise<any>) => Promise<any[]>;
export declare const createRoundRobinIterator: <T>() => (items: T[], each: (value: T) => any) => any;
export declare const createRandomIterator: <T>(weights?: number[]) => (items: T[], each: (value: T) => any) => any;
