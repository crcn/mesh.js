var stream = require("obj-stream");

module.exports = function(callback) {
  return function(operation) {
    var writer = stream.writable();
    process.nextTick(function() {
      callback(operation, function(err, result) {
        if (err) return writer.reader.emit("error", err);
        writer.end(result);
      });
    });
    return writer.reader;
  };
};
