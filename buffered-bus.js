import AsyncResponse from "./async-response";

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = Array.isArray(chunkValues) ? chunkValues : chunkValues == void 0 ? [] : [chunkValues];
}

/**
 */

Object.assign(BufferedBus.prototype, {
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
