var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can limit to 1 operation at a time", function(next) {

    var i = 0;

    var busA = mesh.wrap(function(operation, next) {
      i++;
      setTimeout(next, 10);
    });

    var bus = mesh.limit(1, busA);
    bus(mesh.op({ name: "run" }));
    bus(mesh.op({ name: "run" }));
    bus(mesh.op({ name: "run" }));
    bus(mesh.op({ name: "run" }));
    setTimeout(function() {
      expect(i).to.be(1);
      next();
    }, 1);
  });

  it("properly executes all ops in sequence", function(next) {

    var i = 0;
    var j = 0;

    var busA = mesh.wrap(function(operation, next) {
      i++;
      setTimeout(next, 1);
    });

    var bus = mesh.limit(1, busA);
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(1);
      expect(i).to.be(1);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(2);
      expect(i).to.be(2);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(3);
      expect(i).to.be(3);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      expect(j).to.be(3);
      expect(i).to.be(4);
      next();
    });
  });

  it("run multiple ops at the same time", function(next) {

    var i = 0;
    var j = 0;

    var busA = mesh.wrap(function(operation, next) {
      i++;
      setTimeout(next, 1);
    });

    var bus = mesh.limit(2, busA);
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(1);
      expect(i).to.be(2);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(2);
      expect(i).to.be(2);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      j++;
      expect(j).to.be(3);
      expect(i).to.be(4);
    });
    bus(mesh.op({ name: "run" })).on("end", function() {
      expect(j).to.be(3);
      expect(i).to.be(4);
      next();
    });
  });

  it("can pass an error down and still work", function(next) {
    var bus = mesh.limit(1, mesh.yields(new Error("error")));
    bus(mesh.op("error")).on("error", function() { });
    bus(mesh.op("error")).on("error", function() { });
    bus(mesh.op("error")).on("error", function() {
      next();
    });
  });
});
