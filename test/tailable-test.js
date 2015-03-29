var crudlet = require("../");
var through = require("through2");
var expect  = require("expect.js");

describe(__filename + "#", function() {

  it("can tail a db", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        this.push(operation);
        next();
      });
    }

    var db = crudlet.tailable(db);
    crudlet.stream(db).on("data", function(operation) {
      expect(operation.name).to.be("insert");
      next();
    }).end(crudlet.operation("tail"));

    crudlet.stream(db).write(crudlet.operation("insert"));
  });
});