import { Bus, FallbackBus, BufferedBus, EmptyResponse } from "..";
import expect from "expect.js";
import co from "co";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new FallbackBus()).to.be.an(Bus);
  });

  it("sequentially executes busses until data is emitted by one of them", co.wrap(function*() {

    var bus = new FallbackBus([
      new BufferedBus(),
      new BufferedBus(void 0, ["a", "b", "c"]),
      new BufferedBus(void 0, "d")
    ]);

    var response = bus.execute();
    expect((yield response.read()).value).to.be("a");
    expect((yield response.read()).value).to.be("b");
    expect((yield response.read()).value).to.be("c");
    expect((yield response.read()).done).to.be(true);
  }));

  it("stops execution if an error occurs", co.wrap(function*() {

    var bus = new FallbackBus([
      new BufferedBus(new Error("an error")),
      new BufferedBus(void 0, ["a"])
    ]);

    var err;
    var response = bus.execute();

    try {
      expect((yield response.read()).value).to.be("a");
    } catch (e) { err = e; }

    expect(err.message).to.be("an error");

    // TODO
    // expect((yield response.read()).done).to.be(true);
  }));

  it("continues run operations if a bus has been removed", co.wrap(function*() {
    var busses = [
      {
        execute: function(operation) {
          busses.splice(0, 1);
          return new EmptyResponse();
        }
      },
      new BufferedBus(void 0, "a")
    ];

    var bus = new FallbackBus(busses);
    expect((yield bus.execute({}).read()).value).to.be("a");
  }));
});
