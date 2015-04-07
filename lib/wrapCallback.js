var stream   = require("obj-stream");
var _toArray = require("./_toArray");
var _async   = require("./_async");

module.exports = function(callback) {
  return function(operation) {
    return _async(function(writer) {
      callback(operation, function(err, data) {
        if (err) return writer.reader.emit("error", err);

        _toArray(data).forEach(function(data) {
          writer.write(data);
        });

        writer.end();
      });
    });
  };
};
