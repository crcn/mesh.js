import { ProxyBus } from "mesh";
import { DSMessage, DSInsertRequest, DSFindRequest, DSFindAllRequest, DSRemoveRequest, DSUpdateRequest } from "./messages";
import { IStreamableBus, DuplexAsyncIterableIterator, wrapDuplexAsyncIterableIterator, TransformStream } from "mesh";

export abstract class BaseDataStore implements IStreamableBus<DSMessage> {
  private _proxy: ProxyBus;

  constructor() {
    this._proxy = new ProxyBus({
      dispatch: (message: DSMessage) => {
        const method = this[message.type];
        if (method) {
          return new DuplexAsyncIterableIterator((input, output) => {
            wrapDuplexAsyncIterableIterator(method.call(this, message)).readable.pipeTo(output);
          });
        }
        return DuplexAsyncIterableIterator.empty();
      }
    });

    this._proxy.pause();
    setImmediate(this.initialize.bind(this));
  }

  dispatch(message: DSMessage) {
    return this._proxy.dispatch(message);
  }

  private async initialize() {
    await this.connect();
    this._proxy.resume();
  }

  protected async connect() { }

  // TODO
  // public tail(message: DS)

  abstract dsFind(message: DSFindRequest<any>): any;
  abstract dsInsert(message: DSInsertRequest<any>): any;
  abstract dsRemove(message: DSRemoveRequest<any>): any;
  abstract dsUpdate(message: DSUpdateRequest<any, any>): any;
}