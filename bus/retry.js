import Bus from "./base";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";

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
