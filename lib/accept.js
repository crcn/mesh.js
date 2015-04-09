var stream = require("obj-stream");
var _async   = require("./_async");

module.exports = function() {

  var args   = Array.prototype.slice.call(arguments).map(function(a) {
    var toa = typeof a;
    if (toa === "string") return function(b) {
      return a === b.name;
    };

    if (toa === "function") return a;
  });

  var db     = args.pop();
  var accept = args;

  return function(operation) {
    for (var i = accept.length; i--;) {
      if (accept[i](operation)) return db.apply(this, arguments);
    }
    return _async(function(writable) {
      writable.end();
    });
  };
};
