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

    var op = bus(mesh.op("hello", { multi: true }));

    op.on("data", function(message) {
        expect(message).to.be("olleh");
        next();
      });
  });

  it("can handle errors", function(next) {
    var bus = mesh.reduce(mesh.yields(new Error("err")), function() {

    });
    bus(mesh.op("a")).on("error", next.bind(void 0, void 0));
  });
});
