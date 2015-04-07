var Writable = require("obj-stream").Writable;
var _async   = require("./_async");

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;

    return _async(function(writable) {
      function run() {
        if (i >= dbs.length) return writable.end();
        var db = dbs[i++];
        db(operation).on("data", function(data) {
          writable.write(data);
        }).on("end", run);
      }
      run();
    });
  };
};
