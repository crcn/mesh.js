var createOperation = require("./operation");
var extend          = require("xtend/mutable");

module.exports = function(bus, options) {
  return function(operation) {
    return bus(extend({}, operation, options));
  };
};
