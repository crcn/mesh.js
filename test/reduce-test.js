var mesh = require("../");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {
  it("can reduce operation data", function(next) {

    var bus = function(operation) {
      return _(operation.name.split(""));
    };

    bus = mesh.reduce(bus, function(op, pv, nv) {
      return nv + pv;
    });

    bus(mesh.op("hello", { multi: true }))
      .on("data", function(message) {
        expect(message).to.be("olleh");
        next();
      });
  });
});
