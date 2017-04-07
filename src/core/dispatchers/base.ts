import { DuplexStream, TransformStream } from "../streams";

/**
 * Dispatches a message to a listener
 */

export interface IDispatcher<T, U> {

  /**
   */

  dispatch(message: T): U;
}


/**
 * Dispatches a message to a listener
 */

export interface IStreamableDispatcher<T> extends IDispatcher<T, TransformStream<any, any>> {

  /**
   */

  dispatch(message: T): TransformStream<any, any>;
}

/**
 * alias for streamable dispatcher
 */

export interface IBus<T> extends IStreamableDispatcher<T> { }

export interface IMessageTester<T> {
  testMessage(message: T): boolean;
}

export const testDispatcherMessage = (target: any, message: any) => {
  return !!(target && (<IMessageTester<any>><any>target).testMessage && (<IMessageTester<any>><any>target).testMessage(message));
}