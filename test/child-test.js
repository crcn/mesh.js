var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can be created", function(next) {

    function bus(operation) {
      return _([operation]);
    }

    var child  = mesh.clean(mesh.child(bus, { a: 1 }));

    child("insert", { b: 2 }).once("data", function(data) {
      expect(data.a).to.be(1);
      expect(data.b).to.be(2);
      next();
    });
  });
});
