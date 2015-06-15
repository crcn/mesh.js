var memory = require("mesh-memory");
var mesh   = require("../..");
var cache  = require("../cache");

module.exports = function(bus, options) {
  if (!options) options = {};

  var storage   = options.storage   || memory();
  storage       = mesh.limit(1, storage);
  var ping      = options.ping;
  var interval  = options.interval  || 1000 * 5;
  var testError = options.testError || function() {
    return false;
  };

  var isOnline = true;

  var online = mesh.stream(function(operation, stream) {
    var request = bus(operation);

    if (operation.name === "load") {

      // purge cache
      storage({ name: "remove", collection: operation.collection });

    }

    request
    .on("error", function(error) {
      if (testError(error)) {
        offline(operation).pipe(stream, { end: true });
      } else {
        stream.emit("error", error);
      }
    })
    .on("data", function(data) {
      stream.write(data);
      if (operation.name === "load") {
        storage({ name: "insert", collection: operation.collection, data: operation.data });
      }
    })
    .on("end", function() {
      stream.end();
    });
  });

  var offline = mesh.stream(function(operation, stream) {

  });

  return online;
};
