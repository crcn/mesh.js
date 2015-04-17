var stream     = require("obj-stream");
var _async     = require("./_async");
var _getFilter = require("./_getFilter");
var accept     = require("./accept");

module.exports = function(reject, bus) {
  var filter = _getFilter(reject);
  return accept(function(operation) {
    return !filter(operation);
  }, bus);
};
