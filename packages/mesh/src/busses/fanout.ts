import { IBus, IStreamableBus } from "./base";

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

export type FanoutBusTargetsParamType<T> = IBus<T, any>[] | (<T>(message: T) => IBus<T, any>[]);

// TODO - weighted bus

export class FanoutBus<T> implements IStreamableBus<T> {
  private getTargets: <T>(message: T) => IBus<T, any>[];

  constructor(private _targets: FanoutBusTargetsParamType<T>, private _iterator: IteratorType<IBus<T, any>>) {
    this.getTargets = typeof _targets === "function" ? _targets : () => _targets;
  }
  dispatch(message: T) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();

      let spare: ReadableStream<any> = input, child: ReadableStream<any>;

      let pending = 0;

      this._iterator(this.getTargets(message), (target: IBus<T, any>) => {

        let response = target.dispatch(message);

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

export const createFanoutBus = <T>(targets: FanoutBusTargetsParamType<T>, iterator: IteratorType<IBus<T, any>>) => new FanoutBus(targets, iterator);

/**
 * Executes a message against all target busses in one after the other.
 */

export class SequenceBus<T> extends FanoutBus<T> {
  constructor(targets: FanoutBusTargetsParamType<T>) {
    super(targets, sequenceIterator);
  }
}

export const createSequenceBus = <T>(targets: FanoutBusTargetsParamType<T>) => new SequenceBus(targets);

/**
 * Executes a message against all target busses at the same time.
 */

export class ParallelBus<T> extends FanoutBus<T> {
  constructor(targets: FanoutBusTargetsParamType<T>) {
    super(targets, parallelIterator);
  }
}

export const createParallelBus = <T>(targets: FanoutBusTargetsParamType<T>) => new ParallelBus(targets);

/**
 * Executes a message against one target bus that is rotated with each message.
 */

export class RoundRobinBus<T> extends FanoutBus<T> {
  constructor(targets: FanoutBusTargetsParamType<T>) {
    super(targets, createRoundRobinIterator());
  }
}

export const createRoundRobinBus = <T>(targets: FanoutBusTargetsParamType<T>) => new RoundRobinBus(targets);

/**
 * Executes a message against one target bus that is selected at random.
 */

export class RandomBus<T> extends FanoutBus<T> {
  constructor(targets: FanoutBusTargetsParamType<T>, weights?: number[]) {
    super(targets, createRandomIterator(weights));
  }
}

export const createRandomBus = <T>(targets: FanoutBusTargetsParamType<T>, weights?: number[]) => new RandomBus(targets, weights);