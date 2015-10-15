var Bus = require('./base');
var extend = require('../internal/extend');
var AsyncResponse = require('../response/async');
var pump = require('../internal/pump-stream');

/**
 */

function FallbackBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, FallbackBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {
      var busses = this._busses.concat();
      var next = (i) => {
        if (i === busses.length) return writable.end();
        var response = busses[i].execute(operation);
        var hasChunk = false;
        pump(response, (chunk) => {
          if (chunk.done) {
            if (hasChunk) {
              writable.end();
            } else {
              next(i + 1);
            }
          } else {
            hasChunk = true;
            writable.write(chunk.value);
          }
        }, writable.abort.bind(writable));
      };
      next(0);
    });
  }
});

/**
 */

module.exports =  FallbackBus;
