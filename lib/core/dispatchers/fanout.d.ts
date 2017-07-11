import { IBus, IDispatcher } from "./base";
import { DuplexStream } from "../streams";
import { IteratorType } from "../utils";
export declare type FanoutBusDispatchersParamType<T> = IDispatcher<T, any>[] | (<T>(message: T) => IDispatcher<T, any>[]);
export declare class FanoutBus<T> implements IBus<T> {
    private _dispatchers;
    private _iterator;
    private getDispatchers;
    constructor(_dispatchers: FanoutBusDispatchersParamType<T>, _iterator: IteratorType<IDispatcher<T, any>>);
    dispatch(message: T): DuplexStream<{}, {}>;
}
export declare class SequenceBus<T> extends FanoutBus<T> {
    constructor(dispatchers: FanoutBusDispatchersParamType<T>);
}
export declare class ParallelBus<T> extends FanoutBus<T> {
    constructor(dispatchers: FanoutBusDispatchersParamType<T>);
}
export declare class RoundRobinBus<T> extends FanoutBus<T> {
    constructor(dispatchers: FanoutBusDispatchersParamType<T>);
}
export declare class RandomBus<T> extends FanoutBus<T> {
    constructor(dispatchers: FanoutBusDispatchersParamType<T>, weights?: number[]);
}
