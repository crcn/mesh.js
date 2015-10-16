var Bus = require('./base');

/**
 */

function _defaults(to) {
  var props = Array.prototype.slice.call(arguments, 1);
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

 Bus.extend(AttachDefaultsBus, {
  execute: function(operation) {
    return this._bus.execute(_defaults(operation, this._properties));
  }
});

/**
 */

module.exports =  AttachDefaultsBus;
