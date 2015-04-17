var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can be run once", function(next) {

    var i = 0;

    var bus = mesh.wrapCallback(function(operation, next) {
      i++;

      setTimeout(next, 1, void 0, 1);
    });

    bus = mesh.race(bus, bus);
    bus(mesh.op("mesh")).on("data", function() {
      expect(i).to.be(2);
      next();
    });
  });

  it("picks the fastest stream", function(next) {
    var i = 0;

    var busA = mesh.wrapCallback(function(operation, next) {
      setTimeout(next, 0, void 0, 1);
    });

    var busB = mesh.wrapCallback(function(operation, next) {
      setTimeout(next, 10, void 0, 4);
    });

    bus = mesh.race(busA, busB);
    bus(mesh.op("test")).on("data", function(data) {
      expect(data).to.be(1);
      next();
    });
  });

  it("can run without any args", function(next) {
    var bus = mesh.race();
    bus(mesh.op("insert")).on("end", next);
  });
});
