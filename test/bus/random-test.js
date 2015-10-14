var mesh = require("../..");
var RandomBus = mesh.RandomBus;
var BufferedBus = mesh.BufferedBus;
var Bus = mesh.Bus;
var expect = require("expect.js");
var co = require("co");
var _ = require("lodash");

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(RandomBus.create()).to.be.an(Bus);
  });

  it("can execute an operation on any bus at random", co.wrap(function*() {

    var bus = RandomBus.create([
      BufferedBus.create(void 0, "a"),
      BufferedBus.create(void 0, "b"),
      BufferedBus.create(void 0, "c")
    ]);

    var buffer = [];
    var n = 1000;

    // a bit dirty, but should give us a sequence of random characters
    for (var i = n; i--;) {
      buffer.push((yield bus.execute().read()).value);
    }

    expect(buffer.join("")).not.to.be(_.repeat("a", n));
  }));
});
