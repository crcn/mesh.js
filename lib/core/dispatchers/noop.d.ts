import { IDispatcher } from "./base";
export declare class NoopDispatcher implements IDispatcher<any, any> {
    dispatch(message: any): void;
}
export declare const noopDispatcherInstance: NoopDispatcher;
