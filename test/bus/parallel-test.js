import { Bus, ParallelBus, AsyncResponse, EmptyResponse, BufferedBus } from "../..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new ParallelBus()).to.be.an(Bus);
  });

  it("executes ops against multiple busses and joins the read() data", co.wrap(function*() {

    var bus = new ParallelBus([
      new BufferedBus(void 0, "a"),
      new BufferedBus(void 0, "b")
    ]);

    var response = bus.execute();

    expect((yield response.read()).value).to.be("a");
    expect((yield response.read()).value).to.be("b");
    expect((yield response.read()).done).to.be(true);
  }));

  it("can receive data from any bus in any order", co.wrap(function*() {
    var bus = new ParallelBus([
      {
        execute: function() {
          return new AsyncResponse(function(writable) {
            setTimeout(writable.end.bind(writable), 30, "a");
          });
        }
      },
      {
        execute: function() {
          return new AsyncResponse(function(writable) {
            setTimeout(writable.end.bind(writable), 20, "b");
          });
        }
      },
      {
        execute: function() {
          return new AsyncResponse(function(writable) {
            setTimeout(writable.end.bind(writable), 10, "c");
          });
        }
      }
    ]);

    var response = bus.execute();

    expect((yield response.read()).value).to.be("c");
    expect((yield response.read()).value).to.be("b");
    expect((yield response.read()).value).to.be("a");
    expect((yield response.read()).done).to.be(true);
  }));

  it("passes errors down", co.wrap(function*() {
    var bus = new ParallelBus([
      new BufferedBus(new Error("error"))
    ]);

    var response = bus.execute();
    var err;

    try {
      yield bus.execute().read();
    } catch (e) { err = e; }

    expect(err.message).to.be("error");
  }));

  it("can continue to execute ops if a bus is removed mid-operation", co.wrap(function*() {
    var busses;
    var bus = new ParallelBus(busses = [
      {
        execute: function(operation) {
          busses.splice(0, 1);
          return new EmptyResponse();
        }
      },
      new BufferedBus(void 0, "a")
    ]);
    var response = bus.execute();
    expect((yield response.read()).value).to.be("a");
  }));

});
