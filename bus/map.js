var Bus = require('./base');
var extend = require('../internal/extend');
var AsyncResponse = require('../response/async');
var pump = require('../internal/pump-stream');

/**
 */

function MapBus(bus, map) {
  this._bus = bus;
  this._map = map;
}

/**
 */

extend(Bus, MapBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {
      pump(this._bus.execute(operation), (chunk) => {
        if (chunk.done) return writable.end();
        try {
          this._map(chunk.value, writable, operation);
        } catch(e) {
          // TODO - end response here. Chunks will continue to be pumped otherwise
          writable.abort(e);
        }
      }, writable.abort.bind(writable));
    });
  }
});

/**
 */

module.exports =  MapBus;
