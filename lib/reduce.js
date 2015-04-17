var stream = require("./stream");

module.exports = function(bus, reduce) {
  return stream(function(operation, writable) {
    var buffer;
    bus(operation).on("data", function(data) {

      if (!buffer) {
        buffer = data;
        return;
      }

      buffer = reduce(operation, buffer, data);
    }).on("end", function() {
      writable.end(buffer);
    });
  });
};
