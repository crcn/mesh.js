var _async = require("./_async");

module.exports = function(fn) {
  return function(operation) {
    return _async(function(writable) {
      return fn(operation, writable);
    });
  };
};
