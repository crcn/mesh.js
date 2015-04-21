var mesh = require("../");
var expect  = require("expect.js");
var stream  = require("obj-stream");
var _       = require("highland");

describe(__filename + "#", function() {
  it("can be run", function(next) {

    var i = 0;
    var j = 0;

    var startTime = Date.now();

    var bus = function() {
      i++;
      return _([1]);
    };

    bus = mesh.clean(mesh.first(bus, bus));
    bus("load").on("end", function() {
      expect(i).to.be(1);
      next();
    });
  });

  it("works with readable stream", function(next) {
    var bus = function(operation) {
      var writable = stream.writable();
      process.nextTick(function() {
        writable.end(operation.name);
      });
      return writable.reader;
    };

    bus = mesh.fallback(bus, bus);

    bus(mesh.op("load")).on("data", function(data) {
      expect(data).to.be("load");
      next();
    });
  });

  xit("can run without any args", function(next) {
    var bus = mesh.fallback();
    bus(mesh.op("insert")).on("end", next);
  });
});
