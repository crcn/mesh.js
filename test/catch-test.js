var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {
  it("can be run", function(next) {
    var bus = mesh.wrap(function(operation, callback) {
      callback(new Error("error!"));
    });

    bus = mesh.catchError(bus, function(err) {
      expect(err.message).to.be("error!");
      next();
    });

    bus(mesh.op("blah")).on("error", function() { });
  });
});
