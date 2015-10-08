import Bus from "./bus";
import pipe from "./internal/pipe-stream";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";

/**
 */

function ParallelBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, ParallelBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {

      var busses  = this._busses.concat();
      var numLeft = busses.length;

      busses.forEach((bus) => {
        pipe(bus.execute(operation), writable, { end: false}).then(() => {
          if (!(--numLeft)) writable.end();
        });
      });
    });
  }
});

/**
 */

export default ParallelBus;
