import Bus from "./bus";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";
import pump from "./internal/pump-stream";

/**
 */

function FallbackBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, FallbackBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      var busses = this._busses;
      var next = (i) => {
        if (i === busses.length) return writable.end();
        var response = busses[i].execute(operation);
        var hasChunk = false;
        pump(response, ({value, done}) => {
          if (done) {
            if (hasChunk) {
              writable.end();
            } else {
              next(i + 1);
            }
          } else {
            hasChunk = true;
            writable.write(value);
          }
        }, writable.error.bind(writable));
      };
      next(0);
    });
  }
});

/**
 */

export default FallbackBus;
