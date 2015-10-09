import { Bus, RaceBus, BufferedBus, NoopBus, AsyncResponse, EmptyResponse } from "..";
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

  it("stops execution if an error occurs", co.wrap(function*() {

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

    var bus = new RaceBus(busses);
    expect((yield bus.execute({}).read()).value).to.be("a");
  }));

  it("properly ends if there is no data", co.wrap(function*() {
    var busses = [
      new NoopBus(),
      new NoopBus()
    ];

    var bus = new RaceBus(busses);
    expect((yield bus.execute({}).read()).done).to.be(true);
  }));
});
