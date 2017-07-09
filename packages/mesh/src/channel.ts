import { pump } from "./pump";
import { remote } from "./remote";
import { createDuplexStream } from "./duplex-stream";
import { StreamableDispatcher, Dispatcher } from "./base";

/**
 * Creates a new messaging channel over an existing message stream.
 */

export const createChannelDispatcher = <TMessage>(channel: AsyncIterableIterator<any>, localDispatch: Dispatcher<any, any> = (() => {}), info?: any) => {
   const remoteDispatch = remote({
    info: info,
    adapter: {
      send(message) {
      },
      addListener(listener) {

      }
    }
  }, localDispatch);

  return (message: TMessage) => {
    
  };
}