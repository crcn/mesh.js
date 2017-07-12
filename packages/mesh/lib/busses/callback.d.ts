import { IBus } from "./base";
export declare type BusCallback<T, U> = (message: T) => U;
export declare class CallbackBus<T, U> implements IBus<T, U> {
    readonly callback: BusCallback<T, U>;
    constructor(callback: BusCallback<T, U>);
    dispatch(message: T): U;
}
export declare const createCallbackBus: <T, U>(callback: BusCallback<T, U>) => CallbackBus<T, U>;
