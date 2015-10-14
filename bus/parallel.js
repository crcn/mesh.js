var Bus = require('./base');
var pipe = require('../internal/pipe-stream');
var extend = require('../internal/extend');
var AsyncResponse = require('../response/async');

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

module.exports =  ParallelBus;
