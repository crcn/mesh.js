import { IMessage, IStreamableBus } from "mesh";
export declare class DSTailer implements IStreamableBus<any> {
    readonly target: IStreamableBus<any>;
    private _tails;
    constructor(target: IStreamableBus<any>);
    dispatch(message: IMessage): any;
}
