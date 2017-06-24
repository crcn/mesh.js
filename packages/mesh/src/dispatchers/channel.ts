import { IMessage } from "../messages";
import { RemoteBus } from "./remote";
import { filterFamilyMessage } from "../messages";
import { createCallbackDispatcher } from "./callback";
import { StreamableDispatcher, Dispatcher } from "./base";
import { 
  pump,
  DuplexStream,
  ReadableStream,
  WritableStream,
} from "../streams";

/**
 * Creates a new messaging channel over an existing message stream.
 */


export const createChannelDispatcher = (family: string, input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus: Dispatcher<any, any> = (() => {}), _onClose?: () => any) => {
  // const writer = this._writer = output.getWriter();
    
  // const remoteBus = new RemoteBus({
  //   testMessage: family && filterFamilyMessage,
  //   family: family, 
  //   adapter: {
  //     send(message: any) {
  //       writer.write(message);
  //     },
  //     addListener(listener: any) {
  //       input.pipeTo(new WritableStream({
  //         write: (message) => {
  //           listener(message);
  //         },
  //         close: _onClose,
  //         abort: _onClose
  //       }))
  //     }
  //   }
  // }, localBus);

  // return (message) => 
}