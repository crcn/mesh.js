var noop = require("./noop");

function _defaults(from, to) {
  for (var key in from) {
    if (to[key] == void 0) to[key] = from[key];
  }
  return to;
}

module.exports = function(properties, bus) {

  if (bus.__defaults && typeof bus.__defaults !== "function") {
    bus.__defaults = _defaults(properties, bus.__defaults);
  }

  var ret = function(operation) {
    return bus(_defaults(typeof ret.__defaults === "function" ? ret.__defaults(operation) : ret.__defaults, operation));
  };

  ret.__defaults = typeof properties === "function" ? properties : _defaults(properties, {});

  return ret;
};
