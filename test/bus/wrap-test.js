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
    expect(new WrapBus()).to.be.an(Bus);
  });

  it("wraps a function and executes it", co.wrap(function*() {
    var bus = new WrapBus(function(operation) {
      return new BufferedResponse(void 0, "a " + operation.name);
    });
    expect((yield bus.execute({name: "b"}).read()).value).to.be("a b");
  }));

});
