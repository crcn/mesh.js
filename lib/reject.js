var _getFilter = require("./_getFilter");
var accept     = require("./accept");

module.exports = function(reject, bus, elseBus) {
  var filter = _getFilter(reject);
  return accept(function(operation) {
    return !filter(operation);
  }, bus, elseBus);
};
