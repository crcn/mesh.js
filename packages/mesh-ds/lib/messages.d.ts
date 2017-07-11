import { IMessage, IStreamableBus, DuplexStream } from "mesh";
export declare class DSMessage implements IMessage {
    readonly type: string;
    readonly collectionName: string;
    readonly timestamp: number;
    constructor(type: string, collectionName: string);
}
export declare class DSInsertRequest<T> extends DSMessage {
    readonly data: T;
    static readonly DS_INSERT: string;
    constructor(collectionName: string, data: T);
    static dispatch(collectionName: string, data: any, dispatcher: IStreamableBus<any>): Promise<{}[]>;
}
export declare class DSUpdateRequest<T, U> extends DSMessage {
    readonly data: T;
    readonly query: U;
    static readonly DS_UPDATE: string;
    constructor(collectionName: string, data: T, query: U);
    static dispatch(collectionName: string, data: any, query: any, dispatcher: IStreamableBus<any>): Promise<Array<any>>;
}
export declare class DSFindRequest<T> extends DSMessage {
    readonly query: T;
    readonly multi: boolean;
    static readonly DS_FIND: string;
    constructor(collectionName: string, query: T, multi?: boolean);
    static createFilter(collectionName: string): any;
    static findOne(collectionName: string, query: Object, dispatcher: IStreamableBus<any>): Promise<any>;
    static findMulti(collectionName: string, query: Object, dispatcher: IStreamableBus<any>): Promise<any[]>;
}
export declare class DSTailRequest extends DSMessage {
    readonly query: any;
    static readonly DS_TAIL: string;
    constructor(collectionName: string, query: any);
    static dispatch(collectionName: string, query: any, dispatcher: IStreamableBus<any>): DuplexStream<any, DSTailedOperation>;
}
export declare class DSTailedOperation implements IMessage {
    readonly data: any;
    static readonly DS_TAILED_OPERATION: string;
    readonly type: string;
    constructor(request: DSUpdateRequest<any, any> | DSRemoveRequest<any> | DSInsertRequest<any>, data: any);
}
export declare class DSFindAllRequest extends DSFindRequest<any> {
    constructor(collectionName: string);
}
export declare class DSRemoveRequest<T> extends DSMessage {
    readonly query: T;
    static readonly DS_REMOVE: string;
    constructor(collectionName: string, query: T);
}
