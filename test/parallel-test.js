var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");

describe(__filename + "#", function() {
  it("can be run", function(next) {

    var i = 0;
    var j = 0;

    var startTime = Date.now();

    var db1 = function() {
      return through.obj(function(operation, enc, next) {
        i++;
        this.push({ name: "a" });
        this.push({ name: "a" });
        this.push({ name: "a" });
        setTimeout(next, 50);
      });
    };

    var db2 = function() {
      return through.obj(function(operation, enc, next) {
        i++;
        this.push({ name: "a" });
        this.push({ name: "a" });
        this.push({ name: "a" });
        setTimeout(next, 50);
      });
    };

    var db3 = crudlet.parallel(db1, db2);
    db3().on("data", function() {
      j++;
    }).on("end", function() {
      expect(Date.now() - startTime).to.be.lessThan(80);
      expect(i).to.be(2);
      expect(j).to.be(6);
      next();
    }).end(crudlet.operation("insert"));
  });
});