import Bus from "./base";
import extend from "../internal/extend";

/**
 */

function _defaults(to, ...props) {
  for (var i = 0, n = props.length; i < n; i++) {
    var obj = props[i];
    for (var key in obj) {
      if (to[key] == void 0) to[key] = obj[key];
    }
  }
  return to;
}

/**
 */

function AttachDefaultsBus(properties, bus) {
  this._properties = properties;
  this._bus        = bus;
}

/**
 */

extend(Bus, AttachDefaultsBus, {
  execute: function(operation) {
    return this._bus.execute(_defaults(operation, this._properties));
  }
});

/**
 */

export default AttachDefaultsBus;
