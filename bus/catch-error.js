import Bus from "./base";
import pump from "../internal/pump-stream";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";

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
      pump(this._bus.execute(operation), ({value, done}) => {
        if (done) {
          writable.end();
        } else {
          writable.write(value);
        }
      }, (error) => {
        try {
          var p = this._catchError(error, operation);
          writable.end();
        } catch(e) {
          writable.error(e);
        }
      });
    });
  }
});

/**
 */

export default CatchErrorBus;
