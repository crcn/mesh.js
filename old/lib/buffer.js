var stream = require("./stream");

module.exports = function(bus) {
  return stream(function(operation, stream) {
    var buffer = [];
    var error;
    bus(operation)
    .on("error", function(err) {
      error = err;
      stream.emit("error", err);
    })
    .on("data", buffer.push.bind(buffer))
    .on("end", function() {
      if (!error) {
        buffer.forEach(stream.write.bind(stream));
      }
      stream.end();
    });
  });
};
