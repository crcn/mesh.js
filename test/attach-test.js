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

  it("doesn't set props on the original operation", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, 1);
    });

    bus = mesh.attach({ a: 1 }, bus);
    var op  = mesh.op("load");
    bus(op).on("end", function() {
      expect(op.a).to.be(void 0);
      next();
    });
  });

  it("can use a function to attach props", function(next) {
    var bus = mesh.wrap(function(operation, next) {
      expect(operation.b).to.be(1);
      next(void 0, 1);
    });

    bus = mesh.attach(function(operation) {
      return {
        b: operation.a
      };
    }, bus);
    var op  = mesh.op("load", { a: 1 });
    bus(op).on("end", function() {
      next();
    });
  });

  it("can use a function to attach props", function(next) {
    var bus = mesh.wrap(function(operation, next) {
      expect(operation.b).to.be(1);
      expect(operation.a).to.be(2);
      next(void 0, 1);
    });

    bus = mesh.attach(function(operation) {
      return {
        b: 1
      };
    }, bus);

    bus = mesh.attach({ a: 2 }, bus);

    var op  = mesh.op("load");
    bus(op).on("end", function() {
      next();
    });
  });

  it("can attach properties from the operation into the op", function(next) {
    var bus = mesh.wrap(function(operation, next) {
      expect(operation.b).to.be(2);
      next(void 0, 1);
    });

    bus = mesh.attach("a", bus);
    var op  = mesh.op("load", { a: { b: 2 } });
    bus(op).on("end", function() {
      next();
    });
  });
});
