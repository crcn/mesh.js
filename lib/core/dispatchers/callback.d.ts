import { IDispatcher } from "./base";
export declare type DispatcherCallback<T, U> = (message: T) => U;
export declare class CallbackDispatcher<T, U> implements IDispatcher<T, U> {
    readonly callback: DispatcherCallback<T, U>;
    constructor(callback: DispatcherCallback<T, U>);
    dispatch(message: T): U;
}
