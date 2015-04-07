var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {

  it("can tail a db", function(next) {

    var db = function(name, properties) {
      return _([]);
    };

    db = mesh.clean(mesh.tailable(db));

    db("tail").on("data", function(operation) {
      expect(operation.name).to.be("insert");
      next();
    });

    db(mesh.op("insert"));
  });
});
