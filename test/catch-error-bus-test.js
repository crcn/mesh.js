import { CatchErrorBus, BufferedBus, Bus } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new CatchErrorBus()).to.be.an(Bus);
  });

  it("eats errors that have been caught", co.wrap(function*(next) {
    var caughtError;
    var bus = new CatchErrorBus(new BufferedBus(new Error("an error")), function(error) {
      caughtError = error;
    });

    yield bus.execute().read();
    expect(caughtError.message).to.be("an error");
  }));

  xit("can re-throw ", co.wrap(function*(next) {
    var caughtError;
    var bus = new CatchErrorBus(new BufferedBus(new Error("an error")), function(error) {
      caughtError = error;
    });

    yield bus.execute().read();
    expect(caughtError.message).to.be("an error");
  }));
});
