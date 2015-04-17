var _async = require("./_async");

module.exports = function(bus, reduce) {
  return function(operation) {
    return _async(function(writable) {
      var buffer;
      bus(operation).on("data", function(data) {

        if (!buffer) {
          buffer = data;
          return;
        }

        buffer = reduce(buffer, data);
      }).on("end", function() {
        writable.end(buffer);
      });
    });
  };
};
