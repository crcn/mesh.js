var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {

  it("can write a stream of operations", function(next) {
    var results = [];

    function bus(operation) {
      return _([operation]);
    }

    var stream = mesh.open(bus);
    stream.on("data", function(data) {
      results.push(data);
    });

    stream.on("end", function() {
      expect(results[0].name).to.be("insert");
      expect(results[1].name).to.be("load");
      expect(results[2].name).to.be("remove");
      next();
    });

    stream.write(mesh.operation("insert"));
    stream.write(mesh.operation("load"));
    stream.end(mesh.operation("remove"));
  });
});
