var stream     = require("obj-stream");
var _async     = require("./_async");
var _getFilter = require("./_getFilter");

module.exports = function(accept, bus, elseBus) {

  var filter = _getFilter(accept);

  if (!elseBus) elseBus = _elseBus;

  return function(operation) {
    if (filter(operation)) return bus(operation);
    return elseBus(operation);
  };
};

/**
 */

function _elseBus(operation) {
  return _async(function(writable) {
    writable.end();
  });
}
