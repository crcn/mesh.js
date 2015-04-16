var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {

  it("can tail a bus", function(next) {

    var bus = function(name, properties) {
      return _([]);
    };

    bus = mesh.clean(mesh.tailable(bus));

    bus("tail").on("data", function(operation) {
      expect(operation.name).to.be("insert");
      next();
    });

    bus(mesh.op("insert"));
  });
});
