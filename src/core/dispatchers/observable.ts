import { IDispatcher } from "./base";

export interface IObservable<T> extends IDispatcher<T, any> {
  observe(dispatcher: IDispatcher<T, any>);
  unobserve(dispatcher: IDispatcher<T, any>);
}

export class Observable<T> implements IObservable<T> {

  private _observers: IDispatcher<T, any>[];
  private _messageBus: IDispatcher<T, any>;

  constructor() {
    this._messageBus = this.createMessageBus(this._observers = []);
  }

  protected createMessageBus(observers: IDispatcher<T, any>[]): IDispatcher<T, any> {
    return {
      dispatch: (message) => {
        for (let i = observers.length; i--;) {
          observers[i].dispatch(message);
        }
      }
    }
  }

  observe(dispatcher: IDispatcher<T, any>) {
    this._observers.push(dispatcher);
  }

  unobserve(dispatcher: IDispatcher<T, any>) {
    const index = this._observers.indexOf(dispatcher);
    if (index !== -1) this._observers.splice(index, 1);
  }

  dispatch(message: any) {
    return this._messageBus.dispatch(message);
  }
}