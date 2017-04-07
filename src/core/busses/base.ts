import { DuplexStream, TransformStream } from "../streams";

/**
 * Dispatches a message to a listener
 */

export interface IBus<T, U> {

  /**
   */

  dispatch(message: T): U;
}


/**
 * Dispatches a message to a listener
 */

export interface IStreamableBus<T> extends IBus<T, TransformStream<any, any>> {

  /**
   */

  dispatch(message: T): TransformStream<any, any>;
}

export interface IMessageTester<T> {
  testMessage(message: T): boolean;
}

export const testBusMessage = (target: any, message: any) => {
  return !!(target && (<IMessageTester<any>><any>target).testMessage && (<IMessageTester<any>><any>target).testMessage(message));
}