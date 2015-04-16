var Writable = require("obj-stream").Writable;
var _async   = require("./_async");

/**
 */

module.exports = function() {
  var busses = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;

    return _async(function(writable) {
      function run() {
        if (i >= busses.length) return writable.end();
        var bus = busses[i++];
        bus(operation).on("data", function(data) {
          writable.write(data);
        }).on("end", run);
      }
      run();
    });
  };
};
