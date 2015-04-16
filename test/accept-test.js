var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    var bus = function(operation) {
      return _([operation]);
    };

    bus = mesh.clean(mesh.accept("a", "b", bus));
    bus("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      bus("b").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(1);
        next();
      });
    });
  });

  it("can reject operations", function(next) {
    var bus = function() {
      return _([operation]);
    };

    bus = mesh.clean(mesh.accept("a", "b", bus));
    bus("c").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(0);
      next();
    });
  });

  it("accepts functions for the first arg", function(next) {

    var bus = mesh.wrapCallback(function(operation, next) {
      next(void 0, { name: "a" });
    });

    bus = mesh.accept(function(operation) {
      return operation.name === "a";
    }, bus);

    bus(mesh.op("a")).on("data", function() {
      next();
    });
  });
});
