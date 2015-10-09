import Bus from "./base";
import extend from "../internal/extend";
import BufferedResponse from "../response/buffered";

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = chunkValues;
}

/**
 */

extend(Bus, BufferedBus, {
  execute: function(operation) {
    return new BufferedResponse(this._error, this._chunkValues);
  }
});

/**
 */

export default BufferedBus;
