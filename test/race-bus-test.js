import { Bus, RaceBus, BufferedBus, AsyncResponse } from "..";
import expect from "expect.js";
import co from "co";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new RaceBus()).to.be.an(Bus);
  });

  it("executes all busses at the same time and returns data from the fastest one", co.wrap(function*() {

    var bus = new RaceBus([
      {
        execute: function(operation) {
          return new AsyncResponse(function(response) {
            setTimeout(response.end.bind(response), 10, "a");
          });
        }
      },
      {
        execute: function(operation) {
          return new AsyncResponse(function(response) {
            setTimeout(response.end.bind(response), 0, "b");
          });
        }
      }
    ]);

    var response = bus.execute();
    expect((yield response.read()).value).to.be("b");
    expect((yield response.read()).done).to.be(true);
  }));

  xit("stops execution if an error occurs", co.wrap(function*() {

    var bus = new RaceBus([
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
});
