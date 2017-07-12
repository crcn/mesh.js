import { noopBusInstance } from "./noop";
import { IBus, IStreamableBus, IMessageTester } from "./base";
import { wrapDuplexStream, TransformStream } from "../streams";

/**
 * Executes a message against target bus if filter returns true, otherwise execute a message against falsy bus is provided.
 */

export class FilterBus<T> implements IStreamableBus<T>, IMessageTester<T> {

  /**
   * constructor
   * @param testMessage message filter. if TRUE, then passes message to resolve bus. If FALSE, then passes to reject bus.
   * @param _resolvedTarget target bus when testMessage passes TRUE
   * @param _rejectedTarget target bus when testMessage passes FALSE. Noops if this isn't present.
   */

  constructor(readonly testMessage: (message: T) => boolean, private _resolvedTarget: IBus<T, any> = noopBusInstance, private _rejectedTarget: IBus<T, any> = noopBusInstance) {

  }

  dispatch(message: T) {
    return wrapDuplexStream((this.testMessage(message) ? this._resolvedTarget : this._rejectedTarget).dispatch(message));
  }

}