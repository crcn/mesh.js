import Bus from "./base";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";
import pump from "../internal/pump-stream";

/**
 */

function RetryBus(maxRetries, errorFilter, bus) {

  if (arguments.length === 2) {
    bus         = errorFilter;
    errorFilter = function(error, operation) {
      return true;
    };
  }

  this._maxRetries  = maxRetries;
  this._bus         = bus;
  this._errorFilter = errorFilter;
}

/**
 */

extend(Bus, RetryBus, {

  /**
   */
   
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      var hasChunk  = false;
      var prevError;

      var run = (triesLeft) => {
        if (!triesLeft) return writable.error(prevError);
        var response = this._bus.execute(operation);
        pump(response, ({value, done}) => {
          hasChunk = true;
          if (done) {
            writable.write(value);
          } else {
            writable.end();
          }
        }, (error) => {
          prevError = error;
          run(triesLeft - 1);
        });
      }

      run(this._maxRetries);
    });
  }
});

/**
 */

export default RetryBus;
