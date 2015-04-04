var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;

    var stream = new Writable();

    process.nextTick(function() {
      function run() {
        if (i >= dbs.length) return stream.end();
        var db = dbs[i++];
        db(operation).on("data", function(data) {
          stream.write(data);
        }).on("end", run);
      }
      run();
    });

    return stream.reader;
  };
};
