var _group = require("./_group");
var _async = require("./_async");

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {
      iterator(busses, function(bus, complete) {
        bus(operation).on("data", function(data) {
          stream.write(data);
        }).on("end", complete);
      }, function() {
        stream.end();
      });
    });
  });
};
