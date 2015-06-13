var spy    = require("./index");
var mesh   = require("../../../..");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("can spy on all streams", function(next) {

    var bus = mesh.noop;
    bus     = spy(bus);
    bus     = mesh.reject("spy", mesh.limit(1, bus), bus);

    var ops = [];

    bus({ name: "spy" }).on("data", function(operation) {
      ops.push(operation);
    });

    bus({ name: "insert" });
    bus({ name: "remove" });
    bus({ name: "insert" }).on("end", function() {
      expect(ops.length).to.be(3);
      expect(ops[0].stream).not.to.be(void 0);
      next();
    });
  });

  it("can spy on a stream based on the query", function(next) {

    var bus = mesh.noop;
    bus     = spy(bus, function(spy, operation) {
      return spy.query.name === operation.name;
    });
    bus     = mesh.reject("spy", mesh.limit(1, bus), bus);

    var ops = [];

    bus({ name: "spy", query: { name: "insert"} }).on("data", function(operation) {
      ops.push(operation);
    });

    bus({ name: "insert" });
    bus({ name: "remove" });
    bus({ name: "insert" }).on("end", function() {
      expect(ops.length).to.be(2);
      expect(ops[0].stream).not.to.be(void 0);
      next();
    });
  });
});
