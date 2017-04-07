import { IBus, IDispatcher, IMessageTester } from "./base";
import { noopDispatcherInstance } from "./noop";
import { wrapDuplexStream, TransformStream } from "../streams";

export class FilterBus<T> implements IBus<T>, IMessageTester<T> {
  constructor(readonly testMessage: (message: T) => boolean, private _resolvedTarget: IDispatcher<T, any> = noopDispatcherInstance, private _rejectedTarget: IDispatcher<T, any> = noopDispatcherInstance) {

  }

  dispatch(message: T) {
    return wrapDuplexStream((this.testMessage(message) ? this._resolvedTarget : this._rejectedTarget).dispatch(message));
  }

}