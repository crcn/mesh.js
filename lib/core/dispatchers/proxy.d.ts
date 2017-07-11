import { TransformStream } from "../streams";
import { IBus, IDispatcher, IMessageTester } from "./base";
/**
 * proxies a target bus, and queues messages
 * if there is none until there is
 */
export declare class ProxyBus implements IBus<any>, IMessageTester<any> {
    private _target;
    private _queue;
    private _paused;
    constructor(_target?: IDispatcher<any, any>);
    testMessage(message: any): boolean;
    dispatch(message: any): TransformStream<{}, {}>;
    readonly paused: boolean;
    pause(): void;
    resume(): void;
    target: IDispatcher<any, any>;
    _drain(): void;
}
