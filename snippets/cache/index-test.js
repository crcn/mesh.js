var assert = require("assert");
var mesh   = require("mesh");
var cache  = require("./index");
var memory = require("mesh-memory");
var sift   = require("sift");

describe(__filename + "#", function() {

  var fakeBus;
  var cacheBus;
  var ops;


  beforeEach(function() {
    ops = [];

    fakeBus = mesh.wrap(function(operation, next) {
      ops.push(operation);
      next(void 0, operation);
    });

    cacheBus = memory();
  });

  it("can cache a simple operation", function(next) {
    var bus = mesh.limit(1, cache(fakeBus, {
      storage: cacheBus
    }));

    bus({name:"blah"}).on("data", function(data) {
      assert.equal(data.name, "blah");
      bus({name:"blah"}).on("data", function(data) {
        assert.equal(data.name, "blah");
        assert.equal(ops.length, 1);
        next();
      });
    });
  });

  it("can be selective about what operations to cache", function(next) {
    var bus = mesh.limit(1, cache(fakeBus, {
      storage: cacheBus,
      cache: function(operation) {
        return operation.name === "cacheThis";
      }
    }));

    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "dontCacheThis" })
    bus({ name: "dontCacheThis" })
    bus({ name: "dontCacheThis" }).on("end", function() {
      assert.equal(ops.length, 4);
      next();
    });
  });

  it("can bust the cache on an operation", function(next) {

    var bus = mesh.limit(1, cache(fakeBus, {
      storage: cacheBus,
      cache: function(operation) {
        return operation.name !== "bust";
      },
      bust: function(operation) {
        return operation.name === "bust" ? function() {
          return true;
        } : void 0
      }
    }));

    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "cacheThis" });
    bus({ name: "bust" });
    bus({ name: "cacheThis" }).on("end", function() {
      assert.equal(ops.length, 3);
      next();
    });
  });
});
