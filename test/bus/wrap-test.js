var mesh = require("../..");
var WrapBus = mesh.WrapBus;

var SequenceBus = mesh.SequenceBus;
var NoopBus = mesh.NoopBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var BufferedResponse = mesh.BufferedResponse;
var EmptyResponse = mesh.EmptyResponse;
var ErrorResponse = mesh.ErrorResponse;
var expect = require("expect.js");
var co = require("co");

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new WrapBus(function(){ })).to.be.an(Bus);
  });

  it("wraps a function and executes it", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      return new BufferedResponse(void 0, "a " + operation.name);
    });
    expect((yield bus.execute({name: "b"}).read()).value).to.be("a b");
  }));

  it("automatically catches errors thrown within the runnable", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      throw new Error("an error");
    });
    var err;
    try {
      yield bus.execute().read();
    } catch(e) { err = e; }
    expect(err.message).to.be("an error");
  }));

  it("automatically writes the returned value of a runnable", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      return "a " + operation.name;
    });
    expect((yield bus.execute({name: "b"}).read()).value).to.be("a b");
  }));

  it("can handle an operation that doesn't return anything", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
    });
    expect((yield bus.execute({name: "b"}).read()).done).to.be(true);
  }));

  it("can handle resolved data from promises in a runnable", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      return new Promise(function(resolve, reject) {
        resolve("a");
      })
    });
    expect((yield bus.execute().read()).value).to.be("a");
  }));

  it("can handle rejected data from promises in a runnable", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      return new Promise(function(resolve, reject) {
        reject("an error");
      });
    });

    var err;
    try {
      yield bus.execute().read();
    } catch(e) { err = e; }
    expect(err).to.be("an error");
  }));

  it("can handle resolved data from runnables with a second next() param", co.wrap(function*() {
    var bus = new WrapBus(function(operation, next) {
      next(void 0, "chunk");
    });
    expect((yield bus.execute().read()).value).to.be("chunk");
  }));

  it("can handle resolved data from runnables with a second next() param", co.wrap(function*() {
    var bus = new WrapBus(function(operation, next) {
      next(new Error("an error"));
    });

    var err;

    try {
      yield bus.execute().read();
    } catch(e) { err = e; }

    expect(err.message).to.be("an error");
  }));
});
