var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");

describe(__filename + "#", function() {

  it("can run an operation against a db with 3 params", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        this.push(operation);
        next();
      });
    }

    crudlet.run(db, "load", { a: 1 }).on("data", function(operation) {
      expect(operation.name).to.be("load");
      expect(operation.a).to.be(1);
    }).on("end", next);
  });

  it("pass an operation", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        this.push(operation);
        next();
      });
    }

    crudlet.run(db, crudlet.operation("load", { a: 1 })).on("data", function(operation) {
      expect(operation.name).to.be("load");
      expect(operation.a).to.be(1);
    }).on("end", next);
  });

});
