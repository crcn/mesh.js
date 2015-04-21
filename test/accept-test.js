var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    var bus = function(operation) {
      return _([operation]);
    };

    bus = mesh.clean(mesh.accept("a", bus));
    bus("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      next();
    });
  });

  it("can reject operations", function(next) {
    var bus = function() {
      return _([operation]);
    };

    bus = mesh.clean(mesh.accept("a", bus));
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

  it("can accept regexp", function(next) {
    var i = 0;
    var bus = mesh.accept(/a|b/, mesh.wrap(function(op, next) {
      i++;
      next();
    }));

    bus(mesh.op("a")).on("end", function() {
      bus(mesh.op("b")).on("end", function() {
        bus(mesh.op("c")).on("end", function() {
          expect(i).to.be(2);
          next();
        });
      });
    });
  });

  it("can have an 'else' bus", function(next) {
    var abus = mesh.wrap(function(op, next) {
      next(void 0, "a");
    });

    var bbus = mesh.wrap(function(op, next) {
      next(void 0, "b");
    });

    var cbus = mesh.accept("a", abus, bbus);

    cbus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be("a");
      cbus(mesh.op("b")).on("data", function(data) {
        expect(data).to.be("b");
        next();
      });
    });
  });
});
