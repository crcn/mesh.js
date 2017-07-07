import { createRemoteDispatcher } from "./remote";
import { StreamableDispatcher, Dispatcher } from "./base";
import { 
  pump,
  DuplexStream,
  createDuplexStream,
} from "../utils";

/**
 * Creates a new messaging channel over an existing message stream.
 */

export const createChannelDispatcher = <TMessage>(channel: AsyncIterableIterator<any>, localDispatch: Dispatcher<any, any> = (() => {}), info?: any) => {
   const remoteDispatch = createRemoteDispatcher({
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