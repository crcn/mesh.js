var _isArray = require("./_isArray");

module.exports = function(targetBus) {
  return function(/* ... */ busses) {

    busses = _isArray(busses) ? busses : Array.prototype.slice.call(arguments);

    return function(operation) {
      return targetBus(operation, busses);
    };
  };
};
