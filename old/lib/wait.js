var stream = require("./stream");

module.exports = function(wait, bus) {
  return stream(function(operation, stream) {
    wait(function(error) {
      if (error) return stream.emit("error", error);
      bus(operation).pipe(stream);
    });
  });
};
