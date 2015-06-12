var mesh   = require("mesh");
// var storage = require("mesh-memory");
var storage = require("mesh-local-storage");
var extend = require("extend");

module.exports = function() {

  var bus = storage();

  bus = mesh.tailable(bus, function(tail, operation) {
    return /insert|remove|update/.test(operation.name);
  });

  bus = attachInsertId(bus);

  bus = aliases({
    addItem    : { name: "insert", collection: "items"            },
    getItems   : { name: "load", collection: "items", multi: true },
    removeItem : { name: "remove", collection: "items"            }
  }, bus);

  return bus;
}

function aliases(aliases, bus) {
  return function(operation) {
    var properties = aliases[operation.name] || {};
    return bus(extend({}, operation, properties));
  };
}

var _ref = 0;

function attachInsertId(bus) {
  return mesh.accept("insert", function(operation) {
    operation.data.id = ++_ref;
    return bus(operation);
  }, bus);
}

function alias(properties, bus) {
  return mesh.attach(properties, bus);
}
