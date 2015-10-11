var Bus = require("./base");
var extend = require("../internal/extend");
var AsyncResponse = require("../response/async");
var pump = require("../internal/pump-stream");

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
        pump(response, (chunk) => {
          hasChunk = true;
          if (chunk.done) {
            writable.write(chunk.value);
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

module.exports =  RetryBus;
