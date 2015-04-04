var stream = require("obj-stream");

module.exports = function(db) {

  var args   = Array.prototype.slice.call(arguments);
  var db     = args.pop();
  var accept = args;

  return function(operation) {
    if (!!~accept.indexOf(operation.name)) return db.apply(this, arguments);
    var writable = stream.writable();
    process.nextTick(function() {
      writable.end();
    });
    return writable.reader;
  };
};
