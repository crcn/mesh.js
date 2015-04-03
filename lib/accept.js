var stream = require("obj-stream");

module.exports = function(db, accept) {
  accept = Array.prototype.slice.call(arguments, 1);
  return function(operationName, options) {
    if (!!~accept.indexOf(operationName)) return db(operationName, options);
    var writable = stream.writable();
    process.nextTick(function() {
      writable.end();
    });
    return writable.reader;
  };
};
