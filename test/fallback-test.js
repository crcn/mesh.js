var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
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
});
