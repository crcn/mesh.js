import Bus from "./base";
import extend from "../internal/extend";
import AsyncResponse from "../response/async";
import pump from "../internal/pump-stream";

/**
 */

function MapBus(bus, map) {
  this._bus = bus;
  this._map = map;
}

/**
 */

extend(Bus, MapBus, {
  execute: function(operation) {
    return new AsyncResponse((writable) => {
      pump(this._bus.execute(operation), ({value, done}) => {
        if (done) return writable.end();
        try {
          this._map(value, writable, operation);
        } catch(e) {
          // TODO - end response here. Chunks will continue to be pumped otherwise
          writable.error(e);
        }
      }, writable.error.bind(writable));
    });
  }
});

/**
 */

export default MapBus;
