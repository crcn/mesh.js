var s  = require("obj-stream");
var stream  = require("./stream");
var through = s.through;

module.exports = function(bus, map) {
  return stream(function(operation, writable) {
    bus(operation).pipe(through(function(data, next) {
      var mapper = s.stream();
      mapper.pipe(writable, { end: false });
      mapper.once("end", next);
      map(operation, data, mapper);
    })).on("data", function() { }).on("end", writable.end.bind(writable));
  });
};
