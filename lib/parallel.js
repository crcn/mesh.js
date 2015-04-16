var Writable = require("obj-stream").Writable;
var _async   = require("./_async");

/**
 */

module.exports = function() {
  var busses = Array.prototype.slice.apply(arguments);
  return function(operation) {
    var i = 0;
    var self = this;

    return _async(function(stream) {
      busses.forEach(function(bus) {
        bus(operation).on("data", function(data) {
          stream.write(data);
        }).on("end", function() {
          if (++i >= busses.length) {
            return stream.end();
          }
        });
      });
    });
  };
};
