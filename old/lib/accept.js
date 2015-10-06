var _async     = require("./_async");
var _getFilter = require("./_getFilter");
var noop       = require("./noop");

module.exports = function(accept, bus, elseBus) {

  var filter = _getFilter(accept);

  if (!elseBus) elseBus = noop;

  return function(operation) {
    if (filter(operation)) return bus(operation);
    return elseBus(operation);
  };
};
