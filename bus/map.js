var Bus = require('./base');
var Response = require('../response');

/**
 */

function MapBus(bus, map) {
  this._bus = bus;
  this._map = map;
}

/**
 */

 Bus.extend(MapBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      self._bus.execute(action).pipeTo({
        write: function write(value) {
          try {
            self._map(value, writable, action);
          } catch(e) {
            writable.abort(e);
            return Promise.reject(e);
          }
        },
        close: function close() {
          writable.close();
        },
        abort: writable.abort.bind(writable)
      });
    });
  }
});

/**
 */

module.exports =  MapBus;
