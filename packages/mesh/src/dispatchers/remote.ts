// import { ProxyBus } from "./proxy";
// import { createCallbackDispatcher } from "./callback";
// import { Dispatcher, StreamableDispatcher } from "./base";
// import {
//   Sink,
//   ChunkQueue,
//   DuplexStream,
//   ReadableStream,
//   WritableStream,
//   TransformStream,
//   wrapDuplexStream,
//   WritableStreamDefaultWriter,
//   ReadableStreamDefaultReader
// } from "../streams";

// export interface IRemoteBusAdapter {
//   send(message: any): any;
//   addListener(message: any): any;
// }

// export type RemoteBusMessageTester<T> = (message: T, thisFamily: string, destFamily: string) => boolean;

// export interface IRemoteBusOptions {

//   /**
//    * Family describing the type of application being established
//    */

//   family?: string;

//   /**
//    * adapter for sending and receiving messages
//    */

//   adapter: IRemoteBusAdapter;

//   /**
//    */

//   testMessage?: RemoteBusMessageTester<any>;
// }

// const PASSED_THROUGH_KEY = "$$passedThrough";

// let _messageCount = 0;
// export class RemoteBusMessage {

//   static readonly HELLO    = 0;
//   static readonly DISPATCH = RemoteBusMessage.HELLO    + 1;
//   static readonly RESPONSE = RemoteBusMessage.DISPATCH + 1;
//   static readonly CHUNK    = RemoteBusMessage.RESPONSE + 1;
//   static readonly RESOLVE  = RemoteBusMessage.CHUNK    + 1;
//   static readonly REJECT   = RemoteBusMessage.RESOLVE  + 1;
//   static readonly CLOSE    = RemoteBusMessage.REJECT   + 1;
//   static readonly ABORT    = RemoteBusMessage.CLOSE    + 1;

//   public messageId: string;

//   constructor(readonly type: number, readonly source: string, readonly dest: string, readonly payload?: any) {
//     this.messageId = String(_messageCount++);
//   }
//   serialize(serializer) {
//     return [this.type, this.messageId, this.source, this.dest, serializer.serialize(this.payload)];
//   }
//   static deserialize([type, messageId, source, dests, payload]: any[], serializer) {
//     const message = new RemoteBusMessage(type, source, dests, serializer.deserialize(payload));
//     message.messageId = messageId;
//     return message;
//   }
// }

// const seed = fill0(Math.round(Math.random() * 100), 3);

// let _i = 0;
// const createUID = () => {
//   const now = new Date();
//   return `${seed}${fill0(now.getSeconds())}${_i++}`;
// }

// function fill0(num, min = 2) {
//   let buffer = "" + num;

//   while(buffer.length < min) {
//     buffer = "0" + buffer;
//   }

//   return buffer;
// }

// class RemoteConnection {
//   private writer: WritableStreamDefaultWriter<any>;
//   private _dests: string[];
//   private _closed: boolean;
//   private _spare: ReadableStream<any>;

//   private _pendingPromises: Map<string, [Function, Function]>;

//   constructor(readonly uid: string, readonly adapter: IRemoteBusAdapter, private _serializer: any, private _onClose: Function) {
//     this._dests = [];
//     this._pendingPromises = new Map();
//   }

//   addDest(dest: string) {
//     if (this._dests.indexOf(dest) !== -1) return;
//     this._dests.push(dest);

//     const [spare, child] = this._spare.tee();
//     this._spare = spare;

//     child.pipeTo(new WritableStream({
//       write: (chunk) => {
//         return this.send(new RemoteBusMessage(RemoteBusMessage.CHUNK, this.uid, dest, chunk));
//       },
//       close: () => {
//         this._closed = true;
//         return this.send(new RemoteBusMessage(RemoteBusMessage.CLOSE, this.uid, dest));
//       },
//       abort: (reason: any) => {
//         return this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, this.uid, dest, reason));
//       },
//     })).catch((e) => {
//       this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, this.uid, dest, e));
//     }).then(() => {
//       this._onClose();
//     });
//   }

//   start(readable: ReadableStream<any>, writable: WritableStream<any>) {
//     this._spare = readable;
//     this.writer = writable.getWriter();
//   }

//   close(dest: string) {
//     const i = this._dests.indexOf(dest);
//     if (~i) {
//       this._dests.splice(i, 1);
//     } else {
//       return;
//     }

//     if (this._dests.length) return Promise.resolve();
//     return this.writer.close();
//   }

//   write(chunk) {
//     return this.writer.write(chunk);
//   }

//   abort(error) {
//     return this.writer.abort(error);
//   }

//   private send(message: RemoteBusMessage) {
//     return new Promise((resolve, reject) => {
//       this._pendingPromises.set(message.messageId + message.dest, [resolve, reject]);
//       this.adapter.send(message.serialize(this._serializer));
//     });
//   }

//   resolve([pendingPromiseId, value]) {
//     const pendingPromise = this._pendingPromises.get(pendingPromiseId);
//     if (pendingPromise) {
//       this._pendingPromises.delete(pendingPromiseId);
//       pendingPromise[0](value);
//     }
//   }

//   reject([pendingPromiseId, value]) {
//     const pendingPromise = this._pendingPromises.get(pendingPromiseId);
//     if (pendingPromise) {
//       this._pendingPromises.delete(pendingPromiseId);
//       pendingPromise[1](value);
//     }
//   }
// }

// /**
//  * Transmits messages by serializing & deserializing from and to a remote location over HTTP, 
//  * websockets, and other protocols. 
//  */

// const defaultSerializer = {
//   serialize   : o => o,
//   deserialize : i => i
// };

// export const createRemoteDispatcher = <T>({ adapter, family, testMessage }: IRemoteBusOptions, localDispatcher: Dispatcher<T, any> = (() => {}), serializer: any = defaultSerializer) => {
//   let uid: string = createUID();
//   let proxy: Dispatcher<any, any> = ;
//   let destFamily: string;
//   let _pendingConnections: Map<string, RemoteConnection> = new Map();

// };

// export class RemoteBus<T> implements IStreamableBus<T>, IMessageTester<T> {

//   private _uid: string;
//   private _proxy: ProxyBus;
//   private _family: string;
//   private _destFamily: string;
//   readonly adapter: IRemoteBusAdapter;
//   private _testMessage: RemoteBusMessageTester<T>;
//   private _pendingConnections: Map<string, RemoteConnection>;

//   constructor({ adapter, family, testMessage }: IRemoteBusOptions, private _localBus: IBus<T, any> = noopBusInstance, private _serializer?: any) {
//     this._pendingConnections  = new Map();
//     this.adapter = adapter;
//     this._family = family;
//     this._uid = createUID();

//     if (!_serializer) {
//       this._serializer = {
//         serialize   : o => o,
//         deserialize : i => i
//       };
//     }

//     this._proxy = new ProxyBus(this._dispatchRemoteMessage.bind(this));
//     this._proxy.pause();

//     this._testMessage = testMessage || (message => true);
//     this.adapter.addListener(this.onMessage.bind(this));
//     this.greet(true);
//   }

//   testMessage(message: T) {

//     // return TRUE if dest family doesn't exist. Means that the handshake isn't finished yet.
//     return !this._destFamily || this._testMessage(message, this._family, this._destFamily);
//   }

//   dispose() {
//     this._pendingConnections.forEach((pending) => {
//       pending.abort(new Error("disposed"));
//     });
//   }

//   private greet(shouldSayHiBack?: boolean) {
//     this.adapter.send(new RemoteBusMessage(RemoteBusMessage.HELLO, null, null, [this._family, shouldSayHiBack]).serialize(this._serializer));
//   }

//   private onMessage(data: any[]) {
//     let message: RemoteBusMessage;

//     // some cases where the message is not deserializable - not always an issue, but
//     // may break the remote bus.
//     try {
//       message = RemoteBusMessage.deserialize(data, this._serializer);
//     } catch(e) {
//       console.error(e.stack);
//       return;
//     }

//     // TODO - check if origin is coming from self. Need to update tests for this
//     if (message.type === RemoteBusMessage.DISPATCH) {
//       this.onDispatch(message);
//     } else if (message.type === RemoteBusMessage.RESPONSE) {
//       this.onResponse(message);
//     } else if (message.type === RemoteBusMessage.CHUNK) {
//       this.onChunk(message);
//     } else if (message.type === RemoteBusMessage.CLOSE) {
//       this.onClose(message);
//     }  else if (message.type === RemoteBusMessage.ABORT) {
//       this.onAbort(message);
//     } else if (message.type === RemoteBusMessage.RESOLVE) {
//       this.onResolve(message);
//     } else if (message.type === RemoteBusMessage.REJECT) {
//       this.onReject(message);
//     } else if (message.type === RemoteBusMessage.HELLO) {
//       this.onHello(message);
//     }
//   }

//   private onResolve({ source, dest, payload }: RemoteBusMessage) {
//     const result = payload;
//     this._getConnection(dest, (con, uid) => con.resolve(result));
//   }

//   private onHello({ payload: [family, shouldSayHiBack] }: RemoteBusMessage) {
//     this._destFamily = family;
//     if (shouldSayHiBack) this.greet();
//     this._proxy.resume();
//   }

//   private onReject({ source, dest, payload }: RemoteBusMessage) {
//     const reason = payload;
//     this._getConnection(dest, (con, uid) => con.reject(reason));
//   }

//   private resolve(messageId: string, source: string, dest: string, result: any) {
//     this.adapter.send(new RemoteBusMessage(RemoteBusMessage.RESOLVE, source, dest, [messageId + source, result]).serialize(this._serializer));
//   }

//   private reject(messageId: string, source: string, dest: string, reason: any) {
//     this.adapter.send(new RemoteBusMessage(RemoteBusMessage.REJECT, source, dest, [messageId + source, reason]).serialize(this._serializer));
//   }

//   private onChunk({ messageId, source, dest, payload }: RemoteBusMessage) {
//     this._getConnection(dest, (con, uid) => {
//       this.respond(con.write(payload), messageId, uid, source);
//     });
//   }

//   private onClose({ messageId, source, dest, payload }: RemoteBusMessage) {
//     this._getConnection(dest, (con, uid) => this.respond(con.close(source), messageId, uid, source));
//   }

//   private respond(promise: Promise<any>, messageId: string, source: string, dest: string) {
//     promise.then(this.resolve.bind(this, messageId, source, dest)).catch(this.reject.bind(this, messageId, source, dest));
//   }

//   private onAbort({ messageId, source, dest, payload }: RemoteBusMessage) {
//     this._getConnection(dest, (con, uid) => this.respond(con.abort(payload), messageId, uid, source));
//   }

//   private onDispatch({ payload, source, dest }: RemoteBusMessage) {
//     const targetBus = this._shouldHandleMessage(payload) ? this._localBus : noopBusInstance;
//     const con = new RemoteConnection(createUID(), this.adapter, this._serializer, () => {
//       this._pendingConnections.delete(con.uid);
//     });
//     this._pendingConnections.set(con.uid, con);

//     const { readable, writable } = wrapDuplexStream(targetBus.dispatch(payload));
//     con.start(readable, writable);
//     this.adapter.send(new RemoteBusMessage(RemoteBusMessage.RESPONSE, con.uid, source).serialize(this._serializer));
//     con.addDest(source);
//   }

//   onResponse({ source, dest }: RemoteBusMessage) {
//     this._getConnection(dest, (con, uid) => con.addDest(source));
//   }

//   private _getConnection(uid, each: Function) {
//     const con = this._pendingConnections.get(uid);
//     if (con) each(con, uid);
//   }

//   private _shouldHandleMessage(message: T) {
//     if (!message[PASSED_THROUGH_KEY]) {
//       message[PASSED_THROUGH_KEY] = {};
//     }

//     if (message[PASSED_THROUGH_KEY][this._uid]) return false;
//     return message[PASSED_THROUGH_KEY][this._uid] = true;
//   }

//   dispatch(message: T) {
//     return this._proxy.dispatch(message);
//   }

//   _dispatchRemoteMessage(message: T) {

//     return new DuplexStream((input, output) => {

//       if (!this._shouldHandleMessage(message) || !this.testMessage(message)) {
//         return output.getWriter().close();
//       }

//       const con = new RemoteConnection(createUID(), this.adapter, this._serializer, () => {
//         this._pendingConnections.delete(con.uid);
//       });
//       this._pendingConnections.set(con.uid, con);
//       con.start(input, output);
//       this.adapter.send(new RemoteBusMessage(RemoteBusMessage.DISPATCH, con.uid, null, message).serialize(this._serializer));
//     });
//   }
// }