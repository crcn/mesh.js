var stream = require("obj-stream");

module.exports = function(db) {

  var args   = Array.prototype.slice.call(arguments);
  var db     = args.pop();
  var reject = args;

  return function(operationName, options) {
    if (!~reject.indexOf(operationName)) return db(operationName, options);
    var writable = stream.writable();
    process.nextTick(function() {
      writable.end();
    });
    return writable.reader;
  };
};
