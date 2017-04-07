import { IBus, IStreamableBus, IMessageTester } from "./base";
import { noopDispatcherInstance } from "./noop";
import { wrapDuplexStream, TransformStream } from "../streams";

export class FilterBus<T> implements IStreamableBus<T>, IMessageTester<T> {
  constructor(readonly testMessage: (message: T) => boolean, private _resolvedTarget: IBus<T, any> = noopDispatcherInstance, private _rejectedTarget: IBus<T, any> = noopDispatcherInstance) {

  }

  dispatch(message: T) {
    return wrapDuplexStream((this.testMessage(message) ? this._resolvedTarget : this._rejectedTarget).dispatch(message));
  }

}