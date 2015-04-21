var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    var bus = function(name, properties) {
      return _([properties]);
    };

    bus = mesh.clean(mesh.reject("a" , bus));
    bus("c").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      next();
    });
  });

  it("can reject operations", function(next) {
    var bus = function(name, properties) {
      return _([properties]);
    };

    bus = mesh.clean(mesh.reject("a", bus));
    bus("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(0);
      next();
    });
  });

  it("reject functions for the first arg", function(next) {

    var bus = mesh.wrapCallback(function(operation, next) {
      next(void 0, { name: "a" });
    });

    bus = mesh.reject(function(operation) {
      return operation.name === "a";
    }, bus);

    bus(mesh.op("b")).on("data", function() {
      next();
    });
  });

  it("can have an 'else' bus", function(next) {
    var abus = mesh.wrap(function(op, next) {
      next(void 0, "a");
    });

    var bbus = mesh.wrap(function(op, next) {
      next(void 0, "b");
    });

    var cbus = mesh.reject("a", abus, bbus);

    cbus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be("b");
      cbus(mesh.op("b")).on("data", function(data) {
        expect(data).to.be("a");
        next();
      });
    });
  });
});
