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

  execute: function(operation) {
    return Response.create((writable) => {

      this._bus.execute(operation).pipeTo({
        write: (value) => {
          writable.write(value);
        },
        close: () => {
          writable.close();
        },
        abort: (error) => {
          try {
            var p = this._catchError(error, operation);
            writable.close();
          } catch(e) {
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
