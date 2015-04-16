var Writable    = require("obj-stream").Writable;
var _async      = require("./_async");
var _eachSeries = require("./_eachSeries");
var _group      = require("./_group");

/**
 */

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {

      var found = false;

      iterator(busses, function(bus, next) {
        bus(operation).on("data", function(data) {
          if (found) return;
          found = true;
          stream.write(data);
        }).on("end", function() {
          if (found) {
            stream.end();
          } else {
            next();
          }
        });
      }, function() {
        stream.end();
      });
    });
  });
};
