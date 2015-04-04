var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;
    var self = this;

    var stream = new Writable();

    process.nextTick(function() {
      dbs.forEach(function(db) {
        db(operation).on("data", function(data) {
          stream.write(data);
        }).on("end", function() {
          if (++i >= dbs.length) {
            return stream.end();
          }
        });
      });
    });

    return stream.reader;
  };
};
