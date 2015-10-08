import Bus from "./bus";
import pump from "./internal/pump-stream";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";

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
      var busses  = this._busses;
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach((bus, i) => {
        var response = bus.execute(operation);
        pump(response, ({value, done}) => {
          if (~found && found !== i) return;
          found = i;
          if (done) {
            writable.end();
          } else {
            writable.write(value);
          }
        });
      });
    });
  }
});

/**
 */

export default RaceBus;
