var createOperation = require("./operation");
var extend          = require("xtend/mutable");

// TODO - check if bus is a child. If so, grab target & options and return that instead
module.exports = function(options, bus) {

  if (bus.__attached) {
    options = extend({}, bus.options, options);
    bus     = bus.target;
  }

  function ret(operation) {
    return bus(extend({}, operation, options));
  }

  ret.__attached = true;
  ret.options    = options;
  ret.target     = bus;

  return ret;
};
