import { pump } from "./pump";
import { proxy } from "./proxy";
import { createDuplex } from "./duplex";
import { createQueue, Queue } from "./queue";
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
  NEXT     = CALL  + 1,
  YIELD    = NEXT  + 1,
  RETURN   = YIELD + 1,
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

export const remote = (getOptions: () => RemoteAsyncGeneratorOptions | Promise<RemoteAsyncGeneratorOptions>, call: Function = noop) => {

  const { promise: remotePromise, resolve: resolveRemote } = createDeferredPromise<Function>();

  Promise.resolve(getOptions()).then(({ adapter, info = {} }: RemoteAsyncGeneratorOptions) => {
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
          if (chunk.done) {
            connections.delete(cid);
          }
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

    const onReturn = ({ sid, did, payload: [pid, cid, value] }: RemoteMessage) => {
      if (uid === did) {
        getConnection(cid, connection => connection.return(value).then(chunk => {
          if (chunk.done) {
            connections.delete(cid);
          }
          adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [pid, chunk]))
        }));
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
        case RemoteMessageType.RETURN: return onReturn(message);
      }
    });

    resolveRemote((...args) => createDuplex((input, output) => {
      const cid    = createUID();
      const cpom   = createDeferredPromise();

      const pumpRemoteCall = (did: string, info: any) => {
        pump(input, (value) => {
          const pid = createUID();
          const pom = createDeferredPromise();
          promises.set(pid, pom);
    
          return new Promise((resolve, reject) => {
            pom.promise.then(({ value, done }) => {
              promises.delete(pid);
              if (done) {
                output.return();
                resolve();
              } else {
                output.unshift(value);
                resolve();
              }
            });

            adapter.send(createRemoteMessage(RemoteMessageType.NEXT, uid, did, [pid, cid, value]));
          });
        }).then((value) => {
          const pid = createUID();
          const pom = createDeferredPromise();
          promises.set(pid, pom);
          pom.promise.then(output.return);
          adapter.send(createRemoteMessage(RemoteMessageType.RETURN, uid, did, [pid, cid, value]));
        });
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
    }));
  });

  return proxy(() => remotePromise);
};