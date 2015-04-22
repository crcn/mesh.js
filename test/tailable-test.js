var mesh = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {

  it("can tail a bus", function(next) {

    var bus = function(name, properties) {
      return _([]);
    };

    bus = mesh.clean(mesh.tailable(bus));

    bus("tail").on("data", function(operation) {
      expect(operation.name).to.be("insert");
      next();
    });

    bus(mesh.op("insert"));
  });

  it("emits multiple operations", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, operation.name);
    });

    bus = mesh.tailable(mesh.limit(1, bus));
    var i = 0;

    var tail = bus(mesh.op("tail")).on("data", function() {
      i++;
    });

    bus(mesh.op("hello2"));
    bus(mesh.op("hello2"));
    bus(mesh.op("hello2")).on("end", function() {
      expect(i).to.be(3);
      next();
    });
  });

  it("can end a tail", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, operation.name);
    });

    bus = mesh.tailable(mesh.limit(1, bus));
    var i = 0;

    var tail = bus(mesh.op("tail")).on("data", function() {
      i++;
    });

    bus(mesh.op("hello")).on("end", tail.end.bind(tail));
    bus(mesh.op("hello2"));
    bus(mesh.op("hello3"));
    bus(mesh.op("hello2")).on("end", function() {
      expect(i).to.be(1);
      next();
    });
  });

  it("only emits operations that match the tail props", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, operation.name);
    });

    bus = mesh.tailable(bus);
    var i = 0;

    var tail = bus(mesh.op("tail", { collection: "blarg" })).on("data", function() {
      i++;
    });

    bus(mesh.op("hello2", { collection: "blarg" }));
    bus(mesh.op("hello2"));
    bus(mesh.op("hello2", { collection: "blarg" })).on("end", function() {
      expect(i).to.be(2);
      next();
    });
  });

  it("can accept a custom filter", function(next) {
    var i = 0;

    var bus = mesh.wrap(function(operation, next) {
      next();
    });

    bus = mesh.tailable(bus, function(a, b) {
      return b.collection === a.collection;
    });

    bus(mesh.op("tail", { collection: "a" })).on("data", function() {
      i++;
    });

    bus(mesh.op("insert", { collection: "a" })).on("end", function() {
      bus(mesh.op("insert", { collection: "b" })).on("end", function() {
        expect(i).to.be(1);
        next();
      });
    });
  });
});
