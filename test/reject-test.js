var crudlet = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can accept operations", function(next) {

    function db(name, properties) {
      return _([properties]);
    }

    var db = crudlet.reject(db, "a", "b");
    db("c").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(1);
      db("d").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(1);
        next();
      });
    });
  });

  it("can reject operations", function(next) {
    function db(name, properties) {
      return _([properties]);
    }

    var db = crudlet.reject(db, "a", "b");
    db("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
      expect(items.length).to.be(0);
      db("a").pipe(_.pipeline(_.collect)).on("data", function(items) {
        expect(items.length).to.be(0);
        next();
      });
    });
  });
});
