var crudlet = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    var db = function(name, properties) {
      return _([properties]);
    };

    db = crudlet.accept("a", "b", db);
    db("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      db("b").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(1);
        next();
      });
    });
  });

  it("can reject operations", function(next) {
    var db = function(name, properties) {
      return _([properties]);
    };

    db = crudlet.accept("a", "b", db);
    db("c").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(0);
      next();
    });
  });
});
