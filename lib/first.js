var Writable = require("obj-stream").Writable;
var _async   = require("./_async");

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;

    return _async(function(stream) {
      function run() {
        if (i >= dbs.length) return stream.end();
        var db = dbs[i++];
        var found = false;
        db(operation).on("data", function(data) {
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
  };
};
