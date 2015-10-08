import AsyncResponse from "./async-response";
import pipe          from "./utils/pipe-stream";

/**
 */

function ParallelBus(busses) {
  this._busses = busses;
}

/**
 */

Object.assign(ParallelBus.prototype, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {

      var busses  = this._busses.concat();
      var numLeft = busses.length;

      busses.forEach((bus) => {
        pipe(bus.execute(operation), writable, { end: false}).then(() => {
          if(!(--numLeft)) writable.end();
        });
      });
    });
  }
});

/**
 */

export default ParallelBus;
