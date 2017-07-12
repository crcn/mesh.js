import { IBus, IStreamableBus } from "./base";
import { DuplexStream } from "../streams";
import { IteratorType } from "../utils";
export declare type FanoutBusTargetsParamType<T> = IBus<T, any>[] | (<T>(message: T) => IBus<T, any>[]);
export declare class FanoutBus<T> implements IStreamableBus<T> {
    private _targets;
    private _iterator;
    private getTargets;
    constructor(_targets: FanoutBusTargetsParamType<T>, _iterator: IteratorType<IBus<T, any>>);
    dispatch(message: T): DuplexStream<{}, {}>;
}
export declare const createFanoutBus: <T>(targets: FanoutBusTargetsParamType<T>, iterator: IteratorType<IBus<T, any>>) => FanoutBus<T>;
/**
 * Executes a message against all target busses in one after the other.
 */
export declare class SequenceBus<T> extends FanoutBus<T> {
    constructor(targets: FanoutBusTargetsParamType<T>);
}
export declare const createSequenceBus: <T>(targets: FanoutBusTargetsParamType<T>) => SequenceBus<T>;
/**
 * Executes a message against all target busses at the same time.
 */
export declare class ParallelBus<T> extends FanoutBus<T> {
    constructor(targets: FanoutBusTargetsParamType<T>);
}
export declare const createParallelBus: <T>(targets: FanoutBusTargetsParamType<T>) => ParallelBus<T>;
/**
 * Executes a message against one target bus that is rotated with each message.
 */
export declare class RoundRobinBus<T> extends FanoutBus<T> {
    constructor(targets: FanoutBusTargetsParamType<T>);
}
export declare const createRoundRobinBus: <T>(targets: FanoutBusTargetsParamType<T>) => RoundRobinBus<T>;
/**
 * Executes a message against one target bus that is selected at random.
 */
export declare class RandomBus<T> extends FanoutBus<T> {
    constructor(targets: FanoutBusTargetsParamType<T>, weights?: number[]);
}
export declare const createRandomBus: <T>(targets: FanoutBusTargetsParamType<T>, weights?: number[]) => RandomBus<T>;
