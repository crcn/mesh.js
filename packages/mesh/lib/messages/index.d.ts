export interface IMessage {
    readonly type: string;
}
export declare class Message implements IMessage {
    readonly type: string;
    constructor(type: string);
}
export * from "./decorators";
export * from "./filters";
