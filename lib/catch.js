var stream = require("./stream");
module.exports = function(bus, handler) {
  return stream(function(operation, stream) {
    bus(operation).on("error", handler).pipe(stream);
  });
};
