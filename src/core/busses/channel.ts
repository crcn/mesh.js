import { IMessage } from "../messages";
import { RemoteBus } from "./remote";
import { CallbackBus } from "./callback";
import { noopBusInstance } from "./noop";
import { filterFamilyMessage } from "../messages";
import { IStreamableBus, IBus } from "./base";
import { 
  pump,
  DuplexStream,
  ReadableStream,
  WritableStream,
  TransformStream, 
  WritableStreamDefaultWriter,
  ReadableStreamDefaultReader
} from "../streams";

/**
 * Creates a new messaging channel over an existing message stream.
 */

export class ChannelBus implements IStreamableBus<any> {
  private _remoteBus: RemoteBus<any>;
  private _writer: WritableStreamDefaultWriter<any>;
  constructor(family: string, input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus: IBus<any, any> = noopBusInstance, private _onClose?: () => any) {
    const writer = this._writer = output.getWriter();
    
    this._remoteBus = new RemoteBus({
      testMessage: family && filterFamilyMessage,
      family: family, 
      adapter: {
        send(message: any) {
          writer.write(message);
        },
        addListener(listener: any) {
          input.pipeTo(new WritableStream({
            write: (message) => {
              listener(message);
            },
            close: _onClose,
            abort: _onClose
          }))
        }
      }
    }, localBus);
  }

  dispose() {
    this._writer.close();
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }

  static createFromStream(family: string, stream: TransformStream<any, IMessage>, localBus?: IBus<any, any>) {
    return new ChannelBus(family, stream.readable, stream.writable, localBus);
  }
}