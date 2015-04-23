var stream  = require("./stream");
var through = require("obj-stream").through;

module.exports = function(bus, reduce) {
  return stream(function(operation, writable) {
    var buffer;
    bus(operation).pipe(through(function(data, next) {

      if (buffer) {
        buffer = reduce(operation, buffer, data);
      } else {
        buffer = data;
      }

      next();
    }, function() {
      this.push(buffer);
    })).pipe(writable);
  });
};
