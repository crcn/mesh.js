import { SequenceBus, AsyncResponse, EmptyResponse } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  function YieldsBus(error, result) {
    this.execute = function(operation) {
      return new AsyncResponse(function(writable) {
        if (error) return writable.error(error);
        writable.end(result);
      });
    };
  }

  it("executes ops against multiple busses and joins the read() data", co.wrap(function*() {

    var bus = new SequenceBus([
      new YieldsBus(void 0, "a"),
      new YieldsBus(void 0, "b")
    ]);

    var response = bus.execute();

    expect(yield response.read()).to.be("a");
    expect(yield response.read()).to.be("b");
    expect(yield response.read()).to.be(void 0);
  }));

  it("skips a bus that was removed during execution", co.wrap(function*() {

    var rmbus = {
      execute: function(operation) {
        busses.splice(1, 1); // remove the next bus
        return new EmptyResponse();
      }
    };

    var busses = [new YieldsBus(void 0, "a"), rmbus, new YieldsBus(void 0, "b"), new YieldsBus(void 0, "c")];

    var bus = new SequenceBus(busses);
    var response = bus.execute(busses);

    expect(yield response.read()).to.be("a");
    expect(yield response.read()).to.be("b");
    expect(yield response.read()).to.be("c");

  }));

  it("passes errors down", co.wrap(function*() {
    var bus = new SequenceBus([new YieldsBus(new Error("unknown error"))]);
    var err;

    try {
      yield bus.execute({}).read();
    } catch (e) { err = e; }

    expect(err.message).to.be("unknown error");
  }));

});
