import { IBus } from "./base";
/**
 * No-operation bus.
 */
export declare class NoopBus implements IBus<any, any> {
    dispatch(message: any): void;
}
export declare const noopBusInstance: NoopBus;
