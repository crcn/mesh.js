var stream = require("obj-stream");
var _async   = require("./_async");

module.exports = function() {

  var args   = Array.prototype.slice.call(arguments);
  var db     = args.pop();
  var accept = args;

  return function(operation) {
    if (!!~accept.indexOf(operation.name)) return db.apply(this, arguments);
    return _async(function(writable) {
      writable.end();
    });
  };
};
