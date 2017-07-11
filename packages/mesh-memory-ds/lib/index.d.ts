import { BaseDataStore, DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest } from "mesh-ds";
import { DuplexStream } from "mesh";
export declare class MemoryDataStore extends BaseDataStore {
    private _data;
    constructor();
    dsFind({type, collectionName, query, multi}: DSFindRequest<any>): DuplexStream<{}, {}>;
    dsInsert({type, collectionName, data}: DSInsertRequest<any>): DuplexStream<{}, {}>;
    dsRemove({type, collectionName, query}: DSRemoveRequest<any>): DuplexStream<{}, {}>;
    dsUpdate({type, collectionName, query, data}: DSUpdateRequest<any, any>): DuplexStream<{}, {}>;
    private getCollection(collectionName);
}
