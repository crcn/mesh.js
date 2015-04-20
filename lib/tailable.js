var fallback = require("./fallback");
var sequence = require("./sequence");
var accept   = require("./accept");
var stream   = require("./stream");
var _equals  = require("./_equals");
var extend   = require("xtend/mutable");

module.exports = function(bus) {
  var listeners = [];
  var testOps   = {};

  return fallback(
    accept("tail", stream(function(operation, writable) {
      testOps = extend({}, operation);
      delete testOps.name;
      writable.operation = testOps;
      listeners.push(writable);
      writable.once("end", function() {
        listeners.splice(listeners.indexOf(writable), 1);
      });
    })),
    sequence(
      bus,
      stream(function(operation, stream) {
        for (var i = listeners.length; i--;) {
          var listener = listeners[i];
          if (_equals(listener.operation, operation)) {
            listeners[i].write(operation);
          }
        }
        stream.end();
      })
    )
  );
};
