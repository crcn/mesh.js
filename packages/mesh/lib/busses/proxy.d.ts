import { TransformStream } from "../streams";
import { IBus, IStreamableBus, IMessageTester } from "./base";
/**
 * proxies a target bus, and queues messages
 * if there is none until there is
 */
export declare class ProxyBus implements IStreamableBus<any>, IMessageTester<any> {
    private _target;
    private _queue;
    private _paused;
    constructor(_target?: IBus<any, any>);
    testMessage(message: any): boolean;
    dispatch(message: any): TransformStream<{}, {}>;
    readonly paused: boolean;
    pause(): void;
    resume(): void;
    target: IBus<any, any>;
    _drain(): void;
}
