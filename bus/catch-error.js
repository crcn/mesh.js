var Bus = require('./base');
var Response = require('../response');

/**
 */

function CatchErrorBus(bus, catchError) {
  this._bus        = bus;
  this._catchError = catchError;
}

/**
 */

 Bus.extend(CatchErrorBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      self._bus.execute(action).pipeTo({
        write: writable.write.bind(writable),
        close: writable.close.bind(writable),
        abort: function abort(error) {
          try {
            var p = self._catchError(error, action);
            writable.close();
          } catch (e) {
            writable.abort(e);
          }
        }
      });
    });
  }
});

/**
 */

module.exports =  CatchErrorBus;
