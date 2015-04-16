var createOperation = require("./operation");
var extend          = require("xtend/mutable");

// DEPRECATED
module.exports = function(bus, options) {

  if (bus.__isChild) {
    options = extend({}, bus.options, options);
    bus     = bus.target;
  }

  function ret(operation) {
    return bus(extend({}, operation, options));
  }

  ret.__isChild = true;
  ret.options   = options;
  ret.target    = bus;

  return ret;
};
