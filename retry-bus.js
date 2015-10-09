import Bus from "./bus";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";

/**
 */

function RetryBus(count, bus) {
  this._count = count;
  this._bus   = bus;
}

/**
 */

extend(Bus, RetryBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {

    });
  }
});

/**
 */

export default RetryBus;
