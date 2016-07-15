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

  execute(action) {
    return Response.create((writable) => {

      this._bus.execute(action).pipeTo({
        write: (value) => {
          try {
            this._map(value, writable, action);
          } catch(e) {
            writable.abort(e);
            return Promise.reject(e);
          }
        },
        close: () => {
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
