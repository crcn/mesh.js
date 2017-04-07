import { IBus } from "./base";

/**
 * No-operation bus. 
 */

export class NoopBus implements IBus<any, any> {
  dispatch(message: any) { }
}

export const noopBusInstance = new NoopBus();