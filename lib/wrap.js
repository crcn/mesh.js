var _toArray = require("./_toArray");
var stream   = require("./stream");

module.exports = function(callback) {
  return stream(function(operation, stream) {
    callback(operation, function(err, data) {
      if (err) return stream.emit("error", err);

      var items = _toArray(data);

      if (operation.multi) {
        items.forEach(function(data) {
          stream.write(data);
        });
      } else if (!!items.length) {
        stream.write(items[0]);
      }

      stream.end();
    });
  });
};
