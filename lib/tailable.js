var _async   = require("./_async");
var fallback = require("./fallback");
var sequence = require("./sequence");
var accept   = require("./accept");
var wrap     = require("./wrap");
var stream   = require("./stream");

module.exports = function(bus) {
  var listeners = [];
  return fallback(
    accept("tail", stream(function(operation, writable) {
      listeners.push(writable);
      writable.reader.once("end", function() {
        listeners.splice(listeners.indexOf(writable), 1);
      });
    })),
    sequence(
      bus,
      wrap(function(operation, next) {
        for (var i = listeners.length; i--;) {
          listeners[i].write(operation);
        }
        next();
      })
    )
  )
}
