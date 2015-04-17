var stream = require("obj-stream");
var _async = require("./_async");

module.exports = function(bus, map) {

  if (typeof map !== "function") {
    var replace = map;
    map = function(data, writable) {
      writable.end(replace);
    };
  }

  return function(operation) {
    return _async(function(writable) {

      var numStreams = 1;

      function end() {
        if (--numStreams > 0) return;
        writable.end();
      }

      bus(operation).on("data", function(data) {
        numStreams++;
        var mapped = stream.writable();
        mapped.reader.once("end", end).pipe(writable);
        map(data, mapped);
      }).on("end", end);
    });
  };
};
