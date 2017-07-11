export interface Queue<T> extends AsyncIterableIterator<T> {
    unshift(value?: T): any;
}
export declare const createQueue: <T>() => Queue<T>;
