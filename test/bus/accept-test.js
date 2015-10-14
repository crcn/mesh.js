var mesh = require("../..");
var sift = require("sift");
var co = require("co");
var expect = require("expect.js");

var AcceptBus = mesh.AcceptBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new AcceptBus()).to.be.an(mesh.Bus);
  });

  it("can redirect an operation according to the accept bus filter", co.wrap(function*() {
    var bus = new AcceptBus(
      sift({ name: "op1" }),
      new BufferedBus(void 0, "a"),
      new BufferedBus(void 0, "b")
    );

    expect((yield bus.execute({ name: "op1" }).read()).value).to.be("a");
    expect((yield bus.execute({ name: "op2" }).read()).value).to.be("b");
  }));

  it("no-ops the accept bus if it's null", co.wrap(function*() {
    var bus = new mesh.AcceptBus(
      sift({ name: "op1" }),
      void 0,
      new BufferedBus(void 0, "b")
    );

    var chunk = yield bus.execute({ name: "op1" }).read();

    expect(chunk.value).to.be(void 0);
    expect(chunk.done).to.be(true);
  }));

  it("no-ops the reject bus if it's null", co.wrap(function*() {
    var bus = new AcceptBus(
      sift({ name: "op1" })
    );

    var chunk = yield bus.execute({ name: "op2" }).read();

    expect(chunk.value).to.be(void 0);
    expect(chunk.done).to.be(true);
  }));

  it("accepts a resolved value from the filter", co.wrap(function*() {
    var bus = AcceptBus.create(function(operation) {
      return Promise.resolve(operation.name === "a");
    }, BufferedBus.create(void 0, "a"));
    expect((yield bus.execute({ name: "a" }).read()).value).to.be("a");
    expect((yield bus.execute({ name: "b" }).read()).value).to.be(void 0);
  }));

  it("throws an error if the promise is rejected", co.wrap(function*() {
    var bus = AcceptBus.create(function(operation) {
      return Promise.reject(operation.name === "a");
    }, BufferedBus.create(void 0, "a"));
    var err;
    try {
      expect((yield bus.execute({ name: "a" }).read()).value).to.be(void 0);
    } catch(e) {
      err = e;
    }
    expect(err).to.be(true);
  }));
});
