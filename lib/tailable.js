var fallback = require("./fallback");
var sequence = require("./sequence");
var accept   = require("./accept");
var stream   = require("./stream");

module.exports = function(bus) {
  var listeners = [];
  return fallback(
    accept("tail", stream(function(operation, writable) {
      listeners.push(writable);
      writable.once("end", function() {
        listeners.splice(listeners.indexOf(writable), 1);
      });
    })),
    sequence(
      bus,
      stream(function(operation, stream) {
        for (var i = listeners.length; i--;) {
          listeners[i].write(operation);
        }
        stream.end();
      })
    )
  );
};
