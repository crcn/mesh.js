var Writable    = require("obj-stream").Writable;
var _async      = require("./_async");
var _eachSeries = require("./_eachSeries");

/**
 */

module.exports = function() {
  var busses = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;

    return _async(function(stream) {
      _eachSeries(busses, function(bus, next) {
        bus(operation).on("data", function(data) {
          found = true;
          stream.write(data);
        }).on("end", function() {
          if (found) {
            return stream.end();
          } else {
            return next();
          }
        });
      }, function() {
        stream.end();
      });
    });
  };
};
