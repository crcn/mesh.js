var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can be created", function(next) {

    function bus(operation) {
      return _([operation]);
    }

    var child  = mesh.clean(mesh.attach({ a: 1 }, bus));

    child("insert", { b: 2 }).once("data", function(data) {
      expect(data.a).to.be(1);
      expect(data.b).to.be(2);
      next();
    });
  });

  it("copies configs over from a previously decorated bus", function() {

      function bus(operation) {
        return _([operation]);
      }

      var child  = mesh.attach({ a: 1 }, bus);
      expect(child.options.a).to.be(1);
      expect(child.target).to.be(bus);
      child = mesh.attach({ b: 1 }, child);
      expect(child.options.a).to.be(1);
      expect(child.options.b).to.be(1);
      expect(child.target).to.be(bus);
      // expect(child.)
  });

  it("can override a previously decorated prop", function() {

      function bus(operation) {
        return _([operation]);
      }

      var child  = mesh.attach({ a: 1 }, bus);
      expect(child.options.a).to.be(1);
      expect(child.target).to.be(bus);
      child = mesh.attach({ a: 2 }, child);
      expect(child.options.a).to.be(2);
      expect(child.target).to.be(bus);
  });
});
