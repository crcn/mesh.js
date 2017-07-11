import { DSMessage, DSInsertRequest, DSFindRequest, DSRemoveRequest, DSUpdateRequest } from "./messages";
import { IStreamableBus } from "mesh";
export declare abstract class BaseDataStore implements IStreamableBus<DSMessage> {
    private _proxy;
    constructor();
    dispatch(message: DSMessage): any;
    private initialize();
    protected connect(): Promise<void>;
    abstract dsFind(message: DSFindRequest<any>): any;
    abstract dsInsert(message: DSInsertRequest<any>): any;
    abstract dsRemove(message: DSRemoveRequest<any>): any;
    abstract dsUpdate(message: DSUpdateRequest<any, any>): any;
}
