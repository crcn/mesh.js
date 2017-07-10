import { pump } from "./pump";
import { remote } from "./remote";
import { createDuplex } from "./duplex";

/**
 * Creates a new messaging channel over an existing message stream.
 */

export const channel = (channel: AsyncIterableIterator<any>, call: Function, info?: any) => {
   const callRemote = remote({
    info: info,
    adapter: {
      send(message) {
      },
      addListener(listener) {

      }
    }
  }, call);

  return (...args) => {
    
  };
}