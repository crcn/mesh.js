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

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var hasChunk  = false;
      var prevError;

      function run(triesLeft) {
        if (!triesLeft) return writable.abort(prevError);
        var response = self._bus.execute(action);
        response.pipeTo({
          write: function write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: writable.close.bind(writable),
          abort: function abort(error) {
            prevError = error;
            run(triesLeft - 1);
          }
        });
      }

      run(self._maxRetries);
    });
  }
});

/**
 */

module.exports =  RetryBus;
