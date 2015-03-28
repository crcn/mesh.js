var crudlet = require("../");
var through = require("through2");
var expect  = require("expect.js");

describe(__filename + "#", function() {

  it("can be created", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        this.push(operation);
        next();
      });
    }

    var child  = crudlet.child(db, { a: 1 });
    var stream = child();
    stream.once("data", function(data) {
      expect(data.a).to.be(1);
      expect(data.b).to.be(2);
      expect(data.name).to.be("insert");
      next();
    }).end(crudlet.operation("insert", { b: 2 }));
  });
});
