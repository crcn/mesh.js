var Bus = require('./base');
var pump = require('../internal/pump-stream');
var extend = require('../internal/extend');
var AsyncResponse = require('../response/async');

/**
 */

function RaceBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, RaceBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {
      var busses  = this._busses.concat();
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach((bus, i) => {
        var response = bus.execute(operation);
        pump(response, (chunk) => {
          if (chunk.done && !~found) {
            if ((--numLeft) === 0) {
              writable.end();
            }
            return;
          }
          if (~found && found !== i) return;
          if (chunk.done) {
            writable.end();
          } else {
            found = i;
            writable.write(chunk.value);
          }
        }, writable.abort.bind(writable));
      });
    });
  }
});

/**
*/

module.exports =  RaceBus;
