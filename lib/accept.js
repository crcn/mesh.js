var stream     = require("obj-stream");
var _async     = require("./_async");
var _getFilter = require("./_getFilter");

module.exports = function(accept, bus) {

  var filter = _getFilter(accept);

  return function(operation) {
    if (filter(operation)) return bus.apply(this, arguments);
    return _async(function(writable) {
      writable.end();
    });
  };
};
