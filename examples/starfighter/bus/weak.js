var memory = require("mesh-memory");
var mesh   = require("mesh");
var _      = require("highland");

/**
 * Creates a link a -> b. Keeps track of inserts, and removes
 * those inserts when bus A is disposed.
 */

module.exports = function(bus) {

  if (!bus) bus = mesh.noop;

  var db = {};

  var mem = memory({ db: db });

  function dispose(operation, next) {
    for (var collectionName in db) {
      clearCollection(collectionName);
    }
    next();
  }

  function clearCollection(collectionName) {
    mem(mesh.op("load", {
      collection: collectionName,
      multi: true
    }))
    .pipe(_.pipeline(_.collect))
    .on("data", function(items) {
      for (var i = items.length; i--;) {
        bus(mesh.op("remove", {
          collection: collectionName,
          query: { cid: items[i].cid }
        }));
      }
    });
  }

  return mesh.accept(
    /insert|remove/,
    mesh.parallel(mute(mem), bus, mesh.wrap(function(op, next) {
      next();
    })),
    mesh.accept(
      /dispose|disconnect/,
      mesh.wrap(dispose),
      bus
    )
  );
};

/**
 */

function mute(bus) {
  return mesh.wrap(function(operation, next) {
    bus(operation).on("error", next).on("end", next);
  });
}
