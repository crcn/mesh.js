import Bus from "./bus";
import pump from "./internal/pump-stream";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";

/**
 */

function CatchErrorBus(bus, catchError) {
  this._bus        = bus;
  this._catchError = catchError;
}

/**
 */

extend(Bus, CatchErrorBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      pump(this._bus.execute(operation), ({value, done}) => {
        if (done) {
          writable.end();
        } else {
          writable.write(value);
        }
      }, (error) => {
        var p = this._catchError(error);
        if (p == void 0) {
          writable.end();
        }
      });
    });
  }
});

/**
 */

export default CatchErrorBus;
