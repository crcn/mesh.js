import Bus from "./base";
import pump from "../internal/pump-stream";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";

/**
*/

function RaceBus(busses) {
  this._busses = busses;
}

/**
*/

extend(Bus, RaceBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      var busses  = this._busses.concat();
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach((bus, i) => {
        var response = bus.execute(operation);
        pump(response, ({value, done}) => {
          if (done) {
            if (!~found) {
              if ((--numLeft) === 0) {
                writable.end();
              }
              return;
            }
          }
          if (~found && found !== i) return;
          if (done) {
            writable.end();
          } else {
            found = i;
            writable.write(value);
          }
        }, writable.error.bind(writable));
      });
    });
  }
});

/**
*/

export default RaceBus;
