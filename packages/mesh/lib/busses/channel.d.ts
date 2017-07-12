import { IMessage } from "../messages";
import { IStreamableBus, IBus } from "./base";
import { ReadableStream, WritableStream, TransformStream } from "../streams";
/**
 * Creates a new messaging channel over an existing message stream.
 */
export declare class ChannelBus implements IStreamableBus<any> {
    private _onClose;
    private _remoteBus;
    private _writer;
    constructor(family: string, input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus?: IBus<any, any>, _onClose?: () => any);
    dispose(): void;
    dispatch(message: any): TransformStream<{}, {}>;
    static createFromStream(family: string, stream: TransformStream<any, IMessage>, localBus?: IBus<any, any>): ChannelBus;
}
