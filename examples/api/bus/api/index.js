var http   = require("mesh-http");
var cache  = require("extra/cache");
var routes = require("./routes");
var sift   = require("sift");
var mesh   = require("../../../..");
var memory = require("mesh-memory");

/**
 */

module.exports = function(options) {

  var bus = http(options);

  // cache HTTP requests
  bus     = _cache(bus);

  // map operations to HTTP requests
  bus     = _routes(routes, bus);

  return bus;
};

/**
 */

function _cache(bus) {
  return cache(bus, {
    storage: memory(),
    bust: function(operation) {
      return /UPDATE|POST|REMOVE/.test(operation.name) ? {
        path: operation.path
      } : void 0;
    },
    test: function(operation) {
      return operation.name === "GET";
    }
  });
}

/**
 */

function _routes(routes, bus) {

  var handlers = [];

  for (var i = 0, n = routes.length; i < n; i += 2) {
    handlers.push({
      test : sift(routes[i]),
      bus  : mesh.attach(routes[i + 1], bus)
    });
  }

  return function(operation) {
    for (var i = 0, n = handlers.length; i < n; i++) {
      if (handlers[i].test(operation)) return handlers[i].bus(operation);
    }
    return bus(operation);
  };
}
