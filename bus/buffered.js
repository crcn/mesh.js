import Bus from "./base";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = Array.isArray(chunkValues) ? chunkValues : chunkValues == void 0 ? [] : [chunkValues];
}

/**
 */

extend(Bus, BufferedBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      if (this._error) return writable.error(this._error);
      for (var chunkValue of this._chunkValues) {
        writable.write(chunkValue);
      }
      writable.end();
    });
  }
});

/**
 */

export default BufferedBus;
