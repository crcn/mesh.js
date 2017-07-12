import { IBus } from "./base";
export interface IObservableBus<T> extends IBus<T, any> {
    observe(listener: IBus<T, any>): any;
    unobserve(listener: IBus<T, any>): any;
}
export declare class ObservableBus<T> implements IObservableBus<T> {
    private _observers;
    private _messageBus;
    constructor();
    protected createMessageBus(observers: IBus<T, any>[]): IBus<T, any>;
    observe(listener: IBus<T, any>): void;
    unobserve(listener: IBus<T, any>): void;
    dispatch(message: any): any;
}
