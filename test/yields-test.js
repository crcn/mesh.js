var expect = require("expect.js");
var mesh   = require("..");
var _      = require("highland");

describe(__filename + "#", function() {

  it("can yield plain data", function(next) {
    var bus = mesh.yields({ name: "aa" });
    bus(mesh.op("a")).on("data", function(data) {
      expect(data.name).to.be("aa");
      next();
    });
  });

  it("can yield multiple data", function(next) {
    var bus = mesh.yields([1,2]);
    bus(mesh.op("a")).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(2);
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });

  it("can use a fn", function(next) {
    var bus = mesh.yields(function(op) {
      return op.name;
    });
    bus(mesh.op("a")).
    on("data", function(data) {
      expect(data).to.be("a");
      next();
    });
  });

  it("can return an array in a fn", function(next) {
    var bus = mesh.yields(function(op) {
      return [1,2,3];
    });
    bus(mesh.op("a")).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(3);
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      expect(data[2]).to.be(3);
      next();
    });
  });

});
