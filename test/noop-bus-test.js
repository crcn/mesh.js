import { NoopBus } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("can be created", function() {
    var noop = new NoopBus();
  });

  it("returns an empty response with no data", co.wrap(function*() {
    var noop     = new NoopBus();
    var response = noop.execute();
    expect(yield response.read()).to.be(void 0);
  }));
});
