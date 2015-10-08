import { NoopBus, Bus } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new NoopBus()).to.be.an(Bus);
  });

  it("can be created", function() {
    var noop = new NoopBus();
  });

  it("returns an empty response with no data", co.wrap(function*() {
    var noop     = new NoopBus();
    var response = noop.execute();
    expect((yield response.read()).done).to.be(true);
  }));
});
