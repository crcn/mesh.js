import {
  DuplexStream,
  ReadableStream,
  WritableStream,
  TransformStream,
  wrapDuplexStream,
} from "../streams";

import { IBus, IStreamableBus, IMessageTester, testBusMessage } from "./base";

/**
 * proxies a target bus, and queues messages
 * if there is none until there is
 */

export class ProxyBus implements IStreamableBus<any>, IMessageTester<any> {

  private _queue: Array<{ input: ReadableStream<any>, output: WritableStream<any>, message: any }> = [];
  private _paused: boolean;

  constructor(private _target?: IBus<any, any>) {
  }

  testMessage(message: any) {
    return testBusMessage(this._target, message);
  }

  dispatch(message) {
    // no target? put the message in a queue until there is
    if (this.paused) {
      return new DuplexStream((input, output) => {
        this._queue.push({ message, input, output });
      });
    }

    return wrapDuplexStream(this.target.dispatch(message));
  }

  get paused() {
    return this._paused || !this._target;
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
    this._drain();
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;

    // try draining the proxy now.
    this._drain();
  }

  _drain() {
    if (this.paused) return;
    const queue = this._queue.concat();
    this._queue = [];
    while (queue.length) {
      const { input, output, message } = queue.shift();
      wrapDuplexStream(this.target.dispatch(message)).readable.pipeTo(output);
    }
  }
}
