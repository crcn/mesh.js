var stream = require("obj-stream");
var _async = require("./_async");

module.exports = function() {

  var args   = Array.prototype.slice.call(arguments);
  var db     = args.pop();
  var reject = args;

  return function(operation) {
    if (!~reject.indexOf(operation.name)) return db(operation);
    return _async(function(writable) {
      writable.end();
    });
  };
};
