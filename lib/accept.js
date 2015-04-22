var _async     = require("./_async");
var _getFilter = require("./_getFilter");
var _noop      = require("./_noop");

module.exports = function(accept, bus, elseBus) {

  var filter = _getFilter(accept);

  if (!elseBus) elseBus = _noop;

  return function(operation) {
    if (filter(operation)) return bus(operation);
    return elseBus(operation);
  };
};
