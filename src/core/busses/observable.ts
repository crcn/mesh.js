import { IBus } from "./base";

export interface IObservableBus<T> extends IBus<T, any> {
  observe(dispatcher: IBus<T, any>);
  unobserve(dispatcher: IBus<T, any>);
}

export class ObservableBus<T> implements IObservableBus<T> {

  private _observers: IBus<T, any>[];
  private _messageBus: IBus<T, any>;

  constructor() {
    this._messageBus = this.createMessageBus(this._observers = []);
  }

  protected createMessageBus(observers: IBus<T, any>[]): IBus<T, any> {
    return {
      dispatch: (message) => {
        for (let i = observers.length; i--;) {
          observers[i].dispatch(message);
        }
      }
    }
  }

  observe(dispatcher: IBus<T, any>) {
    this._observers.push(dispatcher);
  }

  unobserve(dispatcher: IBus<T, any>) {
    const index = this._observers.indexOf(dispatcher);
    if (index !== -1) this._observers.splice(index, 1);
  }

  dispatch(message: any) {
    return this._messageBus.dispatch(message);
  }
}