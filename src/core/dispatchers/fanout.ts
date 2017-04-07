import { IBus, IDispatcher } from "./base";
import { 
  pump,
  DuplexStream,
  ReadableStream,
  WritableStream,
  wrapDuplexStream,
  ReadableStreamDefaultReader
} from "../streams";
import {
  IteratorType,
  sequenceIterator,
  parallelIterator,
  createRandomIterator,
  createRoundRobinIterator,
} from "../utils";

export type FanoutBusDispatchersParamType<T> = IDispatcher<T, any>[] | (<T>(message: T) => IDispatcher<T, any>[]);

export class FanoutBus<T> implements IBus<T> {
  private getDispatchers: <T>(message: T) => IDispatcher<T, any>[];

  constructor(private _dispatchers: FanoutBusDispatchersParamType<T>, private _iterator: IteratorType<IDispatcher<T, any>>) {
    this.getDispatchers = typeof _dispatchers === "function" ? _dispatchers : () => _dispatchers;
  }
  dispatch(message: T) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();

      let spare: ReadableStream<any> = input, child: ReadableStream<any>;

      let pending = 0;

      this._iterator(this.getDispatchers(message), (dispatcher: IDispatcher<T, any>) => {

        let response = dispatcher.dispatch(message);

        if (response == null) {
          return Promise.resolve();
        }

        [spare, child] = spare.tee();
        response = wrapDuplexStream(response);
        pending++;

        return child
        .pipeThrough(response)
        .pipeTo(new WritableStream({
          write(chunk) {
            return writer.write(chunk);
          },
          close: () => pending--,
          abort: () => pending--
        }))
      })
      .then(writer.close.bind(writer))
      .catch(writer.abort.bind(writer))
      .catch((e) => { });
    });
  }
}

export class SequenceBus<T> extends FanoutBus<T> {
  constructor(dispatchers: FanoutBusDispatchersParamType<T>) {
    super(dispatchers, sequenceIterator);
  }
}

export class ParallelBus<T> extends FanoutBus<T> {
  constructor(dispatchers: FanoutBusDispatchersParamType<T>) {
    super(dispatchers, parallelIterator);
  }
}

export class RoundRobinBus<T> extends FanoutBus<T> {
  constructor(dispatchers: FanoutBusDispatchersParamType<T>) {
    super(dispatchers, createRoundRobinIterator());
  }
}

export class RandomBus<T> extends FanoutBus<T> {
  constructor(dispatchers: FanoutBusDispatchersParamType<T>, weights?: number[]) {
    super(dispatchers, createRandomIterator(weights));
  }
}