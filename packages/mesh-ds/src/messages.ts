import { IMessage, IStreamableBus, readAllChunks, readOneChunk, DuplexAsyncIterableIterator } from "mesh";
import sift from "sift";
// import { serializable } from "@tandem/common/serialize";

export class DSMessage implements IMessage {
  readonly timestamp: number = Date.now();
  constructor(readonly type: string, readonly collectionName: string) {
  }
}

// @serializable("DSInsertRequest")
export class DSInsertRequest<T> extends DSMessage {
  static readonly DS_INSERT = "dsInsert";
  constructor(collectionName: string, readonly data: T) {
    super(DSInsertRequest.DS_INSERT, collectionName);
  }
  static async dispatch(collectionName: string, data: any, dispatcher: IStreamableBus<any>) {
    return await readAllChunks(dispatcher.dispatch(new DSInsertRequest(collectionName, data)));
  }
}

// @serializable("DSUpdateRequest")
export class DSUpdateRequest<T, U> extends DSMessage {
  static readonly DS_UPDATE = "dsUpdate";
  constructor(collectionName: string, readonly data: T, readonly query: U) {
    super(DSUpdateRequest.DS_UPDATE, collectionName);
  }

  static async dispatch(collectionName: string, data: any, query: any, dispatcher: IStreamableBus<any>): Promise<Array<any>> {
    return await readAllChunks(dispatcher.dispatch(new DSUpdateRequest(collectionName, data, query)));
  }
}

// @serializable("DSFindRequest")
export class DSFindRequest<T> extends DSMessage {
  static readonly DS_FIND   = "dsFind";
  constructor(collectionName: string, readonly query: T, readonly multi: boolean = false) {
    super(DSFindRequest.DS_FIND, collectionName);
  }
  static createFilter(collectionName: string) {
    return sift({ collectionName: collectionName } as any);
  }
  static async findOne(collectionName: string, query: Object, dispatcher: IStreamableBus<any>): Promise<any> {
    return (await readOneChunk<any>(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)))).value;
  }
  static async findMulti(collectionName: string, query: Object, dispatcher: IStreamableBus<any>): Promise<any[]> {
    return await readAllChunks(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)));
  }
}

// @serializable("DSTailRequest")
export class DSTailRequest extends DSMessage {
  static readonly DS_TAIL   = "dsTail";
  constructor(collectionName: string, readonly query: any) {
    super(DSTailRequest.DS_TAIL, collectionName);
  }
  static dispatch(collectionName: string, query: any, dispatcher: IStreamableBus<any>): DuplexAsyncIterableIterator<any, DSTailedOperation> {
    return dispatcher.dispatch(new DSTailRequest(collectionName, query)) as DuplexAsyncIterableIterator<any, DSTailedOperation>;
  }
}

// @serializable("DSTailedOperation")
export class DSTailedOperation implements IMessage {
  static readonly DS_TAILED_OPERATION   = "tsTailedOperation";
  readonly type = DSTailedOperation.DS_TAILED_OPERATION;
  constructor(request: DSUpdateRequest<any, any>|DSRemoveRequest<any>|DSInsertRequest<any>, readonly data: any) {
  }
}

// @serializable("DSFindAllRequest")
export class DSFindAllRequest extends DSFindRequest<any> {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

// @serializable("DSRemoveRequest")
export class DSRemoveRequest<T> extends DSMessage {
  static readonly DS_REMOVE   = "dsRemove";
  constructor(collectionName: string, readonly query: T) {
    super(DSRemoveRequest.DS_REMOVE, collectionName);
  }
}