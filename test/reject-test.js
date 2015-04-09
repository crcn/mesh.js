var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    var db = function(name, properties) {
      return _([properties]);
    };

    db = mesh.clean(mesh.reject("a", "b", db));
    db("c").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      db("d").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(1);
        next();
      });
    });
  });

  it("can reject operations", function(next) {
    var db = function(name, properties) {
      return _([properties]);
    };

    db = mesh.clean(mesh.reject("a", "b", db));
    db("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(0);
      db("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(0);
        next();
      });
    });
  });

  it("reject functions for the first arg", function(next) {

    var db = mesh.wrapCallback(function(operation, next) {
      next(void 0, { name: "a" });
    });

    db = mesh.reject(function(operation) {
      return operation.name === "a";
    }, db);

    db(mesh.op("b")).on("data", function() {
      next();
    });
  });
});
