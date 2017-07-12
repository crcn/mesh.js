import { IBus, IStreamableBus, IMessageTester } from "./base";
import { TransformStream } from "../streams";
/**
 * Executes a message against target bus if filter returns true, otherwise execute a message against falsy bus is provided.
 */
export declare class FilterBus<T> implements IStreamableBus<T>, IMessageTester<T> {
    readonly testMessage: (message: T) => boolean;
    private _resolvedTarget;
    private _rejectedTarget;
    /**
     * constructor
     * @param testMessage message filter. if TRUE, then passes message to resolve bus. If FALSE, then passes to reject bus.
     * @param _resolvedTarget target bus when testMessage passes TRUE
     * @param _rejectedTarget target bus when testMessage passes FALSE. Noops if this isn't present.
     */
    constructor(testMessage: (message: T) => boolean, _resolvedTarget?: IBus<T, any>, _rejectedTarget?: IBus<T, any>);
    dispatch(message: T): TransformStream<{}, {}>;
}
