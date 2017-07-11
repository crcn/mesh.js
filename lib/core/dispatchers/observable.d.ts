import { IDispatcher } from "./base";
export interface IObservable<T> extends IDispatcher<T, any> {
    observe(dispatcher: IDispatcher<T, any>): any;
    unobserve(dispatcher: IDispatcher<T, any>): any;
}
export declare class Observable<T> implements IObservable<T> {
    private _observers;
    private _messageBus;
    constructor();
    protected createMessageBus(observers: IDispatcher<T, any>[]): IDispatcher<T, any>;
    observe(dispatcher: IDispatcher<T, any>): void;
    unobserve(dispatcher: IDispatcher<T, any>): void;
    dispatch(message: any): any;
}
