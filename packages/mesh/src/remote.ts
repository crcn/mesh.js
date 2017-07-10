import { pump } from "./pump";
import { createQueue, Queue } from "./queue";
import { createDuplex } from "./duplex";
import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";
import { createDeferredPromise, DeferredPromise } from "./deferred-promise";

const noop = () => {};

export type RemoteAsyncGeneratorAdapter = {
  send(message: any);
  addListener(listener: (message: any) => any);
}

export type RemoteAsyncGeneratorOptions = {
  adapter: RemoteAsyncGeneratorAdapter;
  info?: any;
};

enum RemoteMessageType {
  CALL     = 0,
  NEXT     = CALL + 1,
  YIELD    = NEXT + 1,
}

type RemoteMessage = {
  type: RemoteMessageType;
  sid: string;
  did: string;
  payload: any;
}

const fill0 = (num, min = 2) => {
  let buffer = "" + num;

  while(buffer.length < min) {
    buffer = "0" + buffer;
  }

  return buffer;
}

const seed = fill0(Math.round(Math.random() * 100), 3)

let _i = 0;
const createUID = () => {
  const now = new Date();
  return `${seed}${fill0(now.getSeconds())}${_i++}`;
}

const PASSED_THROUGH_KEY = `$$passedThrough`;

const createRemoteMessage = (type: RemoteMessageType, sid: string, did: string, payload?: any) => ({ type, sid, did, payload });

/**
 * Remote message me this ´doSomething´
 */

export const remote = ({ adapter, info = {} }: RemoteAsyncGeneratorOptions, call: Function = noop) => {

  const uid = createUID();
  const dests: any = {};
  const connections: Map<string, AsyncIterableIterator<any>> = new Map();
  const promises: Map<string, DeferredPromise<any>> = new Map();
  const messageQueue = createQueue();

  const shouldCall = (...args) => {
    return args.some(arg => {
      if (typeof arg === "object") {
        let passedThrough = Reflect.getMetadata(PASSED_THROUGH_KEY, arg) || [];
        if (passedThrough.indexOf(uid) !== -1) {
          return false;
        }
        Reflect.defineMetadata(PASSED_THROUGH_KEY, [...passedThrough, uid], arg);
      } 
      return true;
    });
  }

  const getConnection = (uid: string, each: (connection: AsyncIterableIterator<any>) => any) => {
    const connection = connections.get(uid);
    if (connection) {
      each(connection);
    }
  }

  const onCall = ({ sid, payload: [info, cid, ...args] }: RemoteMessage) => {
    if (shouldCall(...args)) {
      connections.set(cid, wrapAsyncIterableIterator(call(...args)));
      adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [cid, [uid, info]]));
    }
  };

  const onNext = ({ sid, did, payload: [pid, cid, value] }: RemoteMessage) => {
    if (uid === did) {
      getConnection(cid, connection => connection.next(value).then(chunk => {
        adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [pid, chunk]))
      }));
    }
  };

  const onYield = ({ sid, did, payload: [pid, chunk] }: RemoteMessage) => {
    if (uid === did && promises.has(pid)) {
      promises.get(pid).resolve(chunk);
      promises.delete(pid);
    }
  };

  const onResponse = ({ sid, did, payload }: RemoteMessage) => {
    if (promises.has(did)) {
      promises.get(did).resolve(payload);
    }
  };

  // throw incomming messages into a queue so that each gets handled in order, preventing
  // race conditions
  adapter.addListener(message => messageQueue.unshift(message));

  // handle incomming messages
  pump(messageQueue, (message: RemoteMessage) => {
    switch(message.type) {
      case RemoteMessageType.CALL: return onCall(message);
      case RemoteMessageType.NEXT: return onNext(message);
      case RemoteMessageType.YIELD: return onYield(message);
    }
  });

  return (...args) => {
    const cid    = createUID();
    const cpom   = createDeferredPromise();
    const output = createQueue();

    // TODO: possibly add timeout to remove buffer after N seconds (gives time for
    // remote handlers to response) so that this doesn't clog up memory. 
    let buffer = [];
    let inputs: Queue<any>[] = [];
    let numRemoteHandlers = 0;

    const pumpRemoteCall = (did: string, info: any) => {
      numRemoteHandlers++;
      const input = createQueue();
      inputs.push(input);
      for (const value of buffer) {
        input.unshift(value);
      }
      const next = () => {
        input.next().then(({ value }) => {
          const pid = createUID();
          const pom = createDeferredPromise();
          promises.set(pid, pom);

          pom.promise.then(({ value, done }) => {
            promises.delete(pid);
            if (done) {
              if (!--numRemoteHandlers) {
                output.return();
              }
            } else {
              output.unshift(value);
              next();
            }
          });

          adapter.send(createRemoteMessage(RemoteMessageType.NEXT, uid, did, [pid, cid, value]));
        });
      };
      next();
    };

    const waitForResponse = () => {
      const cpom = createDeferredPromise();
      promises.delete(cid);
      promises.set(cid, cpom);
      cpom.promise.then(([dest, info]) => {
        waitForResponse();
        pumpRemoteCall(dest, info);
      });
    };

    if (shouldCall(...args)) {
      waitForResponse();
      adapter.send(createRemoteMessage(RemoteMessageType.CALL, uid, null, [info, cid, ...args])); 
    } else {
      output.return();
    }

    return {
      [Symbol.asyncIterator]: () => this,
      next(value?: any) {
        buffer.push(value);
        for (const input of inputs) {
          input.unshift(value);
        }
        
        return output.next();
      }
    };
  };
}