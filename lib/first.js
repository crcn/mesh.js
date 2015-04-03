var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(name, properties) {
    var i = 0;

    var stream = new Writable();

    process.nextTick(function() {

      function run() {
        if (i >= dbs.length) return stream.end();
        var db = dbs[i++];
        var found = false;
        db(name, properties).on("data", function(data) {
          found = true;
          stream.write(data);
        }).on("end", function() {
          if (found) {
            return stream.end();
          } else {
            return run();
          }
        });
      }
      run();
    });

    return stream.reader;
  };
};
