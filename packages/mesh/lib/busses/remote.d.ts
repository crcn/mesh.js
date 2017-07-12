import { IBus, IStreamableBus, IMessageTester } from "./base";
import { DuplexStream, TransformStream } from "../streams";
export interface IRemoteBusAdapter {
    send(message: any): any;
    addListener(message: any): any;
}
export declare type RemoteBusMessageTester<T> = (message: T, thisFamily: string, destFamily: string) => boolean;
export interface IRemoteBusOptions {
    /**
     * Family describing the type of application being established
     */
    family?: string;
    /**
     * adapter for sending and receiving messages
     */
    adapter: IRemoteBusAdapter;
    /**
     */
    testMessage?: RemoteBusMessageTester<any>;
}
export declare class RemoteBusMessage {
    readonly type: number;
    readonly source: string;
    readonly dest: string;
    readonly payload: any;
    static readonly HELLO: number;
    static readonly DISPATCH: number;
    static readonly RESPONSE: number;
    static readonly CHUNK: number;
    static readonly RESOLVE: number;
    static readonly REJECT: number;
    static readonly CLOSE: number;
    static readonly ABORT: number;
    messageId: string;
    constructor(type: number, source: string, dest: string, payload?: any);
    serialize(serializer: any): any[];
    static deserialize([type, messageId, source, dests, payload]: any[], serializer: any): RemoteBusMessage;
}
/**
 * Transmits messages by serializing & deserializing from and to a remote location over HTTP,
 * websockets, and other protocols.
 */
export declare class RemoteBus<T> implements IStreamableBus<T>, IMessageTester<T> {
    private _localBus;
    private _serializer;
    private _uid;
    private _proxy;
    private _family;
    private _destFamily;
    readonly adapter: IRemoteBusAdapter;
    private _testMessage;
    private _pendingConnections;
    constructor({adapter, family, testMessage}: IRemoteBusOptions, _localBus?: IBus<T, any>, _serializer?: any);
    testMessage(message: T): boolean;
    dispose(): void;
    private greet(shouldSayHiBack?);
    private onMessage(data);
    private onResolve({source, dest, payload});
    private onHello({payload: [family, shouldSayHiBack]});
    private onReject({source, dest, payload});
    private resolve(messageId, source, dest, result);
    private reject(messageId, source, dest, reason);
    private onChunk({messageId, source, dest, payload});
    private onClose({messageId, source, dest, payload});
    private respond(promise, messageId, source, dest);
    private onAbort({messageId, source, dest, payload});
    private onDispatch({payload, source, dest});
    onResponse({source, dest}: RemoteBusMessage): void;
    private _getConnection(uid, each);
    private _shouldHandleMessage(message);
    dispatch(message: T): TransformStream<{}, {}>;
    _dispatchRemoteMessage(message: T): DuplexStream<{}, {}>;
}
