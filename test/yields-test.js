var expect = require("expect.js");
var mesh   = require("..");
var _      = require("highland");

describe(__filename + "#", function() {

  it("can yield plain data", function(next) {
    var bus = mesh.yields(void 0, { name: "aa" });
    bus(mesh.op("a")).on("data", function(data) {
      expect(data.name).to.be("aa");
      next();
    });
  });

  it("can yield multiple data", function(next) {
    var bus = mesh.yields(void 0, [1, 2]);
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
    var bus = mesh.yields(void 0, function(op) {
      return op.name;
    });
    bus(mesh.op("a")).
    on("data", function(data) {
      expect(data).to.be("a");
      next();
    });
  });

  it("can return an array in a fn", function(next) {
    var bus = mesh.yields(void 0, function(op) {
      return [1, 2, 3];
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

  it("can yield an error", function(next) {
    var bus = mesh.yields(new Error("err"));
    bus(mesh.op("d")).on("error", function(error) {
      expect(error.message).to.be("err");
      next();
    });
  });

  it("can yield an error in a fn", function(next) {
    var bus = mesh.yields(function(operation) {
      return new Error(operation.name);
    });
    bus(mesh.op("d")).on("error", function(error) {
      expect(error.message).to.be("d");
      next();
    });
  });
});
