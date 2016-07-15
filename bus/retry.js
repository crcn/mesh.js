var Bus = require('./base');
var Response = require('../response');

/**
 */

function RetryBus(maxRetries, errorFilter, bus) {

  if (arguments.length === 2) {
    bus         = errorFilter;
    errorFilter = function(error, action) {
      return true;
    };
  }

  this._maxRetries  = maxRetries;
  this._bus         = bus;
  this._errorFilter = errorFilter;
}

/**
 */

Bus.extend(RetryBus, {

  /**
   */

  execute(action) {
    return Response.create((writable) => {
      var hasChunk  = false;
      var prevError;

      var run = (triesLeft) => {
        if (!triesLeft) return writable.abort(prevError);
        var response = this._bus.execute(action);
        response.pipeTo({
          write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close() {
            writable.close();
          },
          abort(error) {
            prevError = error;
            run(triesLeft - 1);
          }
        });
      }

      run(this._maxRetries);
    });
  }
});

/**
 */

module.exports =  RetryBus;
