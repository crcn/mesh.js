import { IMessage } from "../messages";
import { IBus, IDispatcher } from "./base";
import { ReadableStream, WritableStream, TransformStream } from "../streams";
export declare class ChannelBus implements IBus<any> {
    private _onClose;
    private _remoteBus;
    private _writer;
    constructor(family: string, input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus?: IDispatcher<any, any>, _onClose?: () => any);
    dispose(): void;
    dispatch(message: any): TransformStream<{}, {}>;
    static createFromStream(family: string, stream: TransformStream<any, IMessage>, localBus?: IDispatcher<any, any>): ChannelBus;
}
