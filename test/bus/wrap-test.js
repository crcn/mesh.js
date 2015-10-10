import { Bus, WrapBus, BufferedResponse } from "../..";
import expect from "expect.js";
import co from "co";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new WrapBus()).to.be.an(Bus);
  });

  it("wraps a function and executes it", co.wrap(function*() {
    var bus = new WrapBus(function({name}) {
      return new BufferedResponse(void 0, `a ${name}`);
    });
    expect((yield bus.execute({name: "b"}).read()).value).to.be("a b");
  }));

});
