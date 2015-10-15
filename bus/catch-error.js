var Bus = require('./base');
var pump = require('../internal/pump-stream');
var extend = require('../internal/extend');
var AsyncResponse = require('../response/async');

/**
 */

function CatchErrorBus(bus, catchError) {
  this._bus        = bus;
  this._catchError = catchError;
}

/**
 */

extend(Bus, CatchErrorBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {
      pump(this._bus.execute(operation), (chunk) => {
        if (chunk.done) {
          writable.end();
        } else {
          writable.write(chunk.value);
        }
      }, (error) => {
        try {
          var p = this._catchError(error, operation);
          writable.end();
        } catch(e) {
          writable.abort(e);
        }
      });
    });
  }
});

/**
 */

module.exports =  CatchErrorBus;
