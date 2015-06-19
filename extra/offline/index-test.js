var offline = require("./index");
var expect  = require("expect.js");
var storage = require("mesh-memory");
var mesh    = require("../..");

describe(__filename + "#", function() {

  var fakebus;
  var ops;

  beforeEach(function() {
    ops = [];
    fakebus = mesh.wrap(function(operation, next) {
      ops.push(operation);
      next.apply(this, operation.yields || [])
    });
  })

  xit("can pass operations to the main bus", function(next) {
    var bus = offline(fakebus);
    bus({}).on("end", function() {
      expect(ops.length).to.be(1);
      next();
    });
  });

  xit("can store operations in a temporary database if the remote bus goes offline", function(next) {

    var mem = storage();
    fakebus = mesh.attach({ yields: [new Error("econrefused")] }, fakebus);

    var bus = offline(fakebus, {
      storage: mem,
      testError: function(err) {
        return !!~err.message.indexOf("econrefused");
      }
    });

    bus({}).on("error", function() {
      console.log("OK");
      next();
    });
  });

  xit("doesn't switch to offline mode if data is emitted before an error");
  xit("stores data from the remote service in the cached db");
});
