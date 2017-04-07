import { IDispatcher } from "./base";

export class NoopDispatcher implements IDispatcher<any, any> {
  dispatch(message: any) { }
}

export const noopDispatcherInstance = new NoopDispatcher();