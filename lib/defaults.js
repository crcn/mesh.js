var noop = require("./noop");

function _defaults(from, to) {
  for (var key in from) {
    if (to[key] == void 0) to[key] = from[key];
  }
  return to;
}

module.exports = function(properties, bus) {

  if (bus.__defaults) {
    bus.__defaults = _defaults(properties, bus.__defaults);
  }

  var ret = function(operation) {
    return bus(_defaults(ret.__defaults, operation));
  };

  ret.__defaults = _defaults(properties, {});

  return ret;
};
