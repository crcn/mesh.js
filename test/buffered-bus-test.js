import { BufferedBus, Bus } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new BufferedBus()).to.be.an(Bus);
  });

  it("can return a buffered chunk", co.wrap(function*() {
    var bus  = new BufferedBus(void 0, "chunk");
    var resp = bus.execute();
    expect((yield resp.read()).value).to.be("chunk");
    expect((yield resp.read()).done).to.be(true);
  }));

  it("does not buffer null", co.wrap(function*() {
    var bus = new BufferedBus(void 0, null);
    var resp = bus.execute();
    expect((yield resp.read()).done).to.be(true);
  }));

  it("does not buffer undefined", co.wrap(function*() {
    var bus = new BufferedBus();
    var resp = bus.execute();
    expect((yield resp.read()).done).to.be(true);
  }));

  it("can buffer 0", co.wrap(function*() {
    var bus = new BufferedBus(void 0, 0);
    var resp = bus.execute();
    expect((yield resp.read()).value).to.be(0);
    expect((yield resp.read()).done).to.be(true);
  }));

  it("can buffer false", co.wrap(function*() {
    var bus = new BufferedBus(void 0, false);
    var resp = bus.execute();
    expect((yield resp.read()).value).to.be(false);
    expect((yield resp.read()).done).to.be(true);
  }));

  it("can buffer an array of chunks", co.wrap(function*() {
    var bus = new BufferedBus(void 0, [0, false, null, void 0, "chunk"]);
    var resp = bus.execute();
    expect((yield resp.read()).value).to.be(0);
    expect((yield resp.read()).value).to.be(false);
    expect((yield resp.read()).value).to.be(null);
    expect((yield resp.read()).value).to.be(void 0);
    expect((yield resp.read()).value).to.be("chunk");
    expect((yield resp.read()).done).to.be(true);
  }));

  it("can buffer and return an error", co.wrap(function*() {
    var bus = new BufferedBus(new Error("some error"));
    var resp = bus.execute();
    var err;

    try {
      yield resp.read();
    } catch (e) { err = e; }

    expect(err.message).to.be("some error");
  }));
});
