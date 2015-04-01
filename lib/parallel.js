var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(name, properties) {
    var i = 0;
    var self = this;

    var stream = new Writable();

    process.nextTick(function() {
      dbs.forEach(function(db) {
        db(name, properties).on("data", function(data) {
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
