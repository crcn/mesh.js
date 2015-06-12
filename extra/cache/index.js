var mesh = require("mesh");

module.exports = function(bus, options) {

  // storage bus
  var cache       = options.storage;

  // create a cache buster
  var bust        = options.bust  || function() {
    return false;
  };

  // creates a query for cached operations
  var createQuery = options.query || function(operation) {
    return operation;
  };

  // tests the operation whether it's cacheable
  var testOp      = options.cache || function(operation) {
    return true;
  };

  
  var retBus = mesh.stream(function(operation, stream) {
    var query    = createQuery(operation);
    var response = cache({ name: "load", collection: "cache", query: { operation: query } });
    var responseData;

    response.once("data", function(data) {
      responseData = data;
    });

    response.once("end", function() {

      if (responseData) {
        responseData.buffer.forEach(function(chunk) {
          stream.write(chunk);
        });
        stream.end();
        return;
      }

      var buffer = [];

      bus(operation).on("data", function(chunk) {
        buffer.push(chunk);
      }).
      on("end", function() {
        cache({
          name       : "insert",
          collection : "cache",
          data       : {
            operation: operation,
            buffer   : buffer
          }
        })
      }).pipe(stream, { end: true });
    });
  });

  return function(operation) {

    // fetch the cache buster
    var bustQuery = bust(operation);

    // if the cache buster exists, then execute it
    if (bustQuery) {
      cache({ name: "remove", collection: "cache", query: bustQuery });
    }

    // if this operation
    if (!testOp(operation)) {
      return bus(operation);
    }

    return retBus(operation);
  };
};
