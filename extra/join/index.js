var mesh          = require("../..");
var _eachParallel = require("../../lib/_eachParallel");
var through       = require("obj-stream").through;

module.exports = function(bus) {

  var joinBus = mesh.stream(function(operation, stream) {

    var join       = operation.join;
    var properties = Object.keys(join);

    bus(operation).pipe(through(function(data, next) {
      var self = this;
      _eachParallel(Object.keys(join), function(property, next) {

        var handler    = join[property];
        var joinStream = handler(data);
        var buffer     = [];

        joinStream.on("data", function(data) {
          buffer.push(data);
        });

        joinStream.on("end", function() {

          var value = buffer;

          var type = Object.prototype.toString.call(data[property]);

          if (typeof data[property] !== "undefined" && type !== "[object Array]") {
            value = buffer.shift();
          }

          data[property] = value;

          self.push(data);
          next();
        });

      }, next);
    })).pipe(stream);
  });

  return function(operation) {
    if (!operation.join) return bus(operation);
    return joinBus(operation);
  };
};
