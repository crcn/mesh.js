var _toArray = require("./_toArray");
var stream   = require("./stream");

module.exports = function(callback) {
  return stream(function(operation, stream) {
    callback(operation, function(err, data) {
      if (err) return stream.emit("error", err);

      var items = _toArray(data);

      _toArray(data).forEach(function(data) {
        stream.write(data);
      });

      stream.end();
    });
  });
};
