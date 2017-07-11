import { IBus, IDispatcher, IMessageTester } from "./base";
import { TransformStream } from "../streams";
export declare class FilterBus<T> implements IBus<T>, IMessageTester<T> {
    readonly testMessage: (message: T) => boolean;
    private _resolvedTarget;
    private _rejectedTarget;
    constructor(testMessage: (message: T) => boolean, _resolvedTarget?: IDispatcher<T, any>, _rejectedTarget?: IDispatcher<T, any>);
    dispatch(message: T): TransformStream<{}, {}>;
}
