import { Bus, AttachDefaultsBus, BufferedResponse } from "../..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {
  it("is a bus", function() {
    expect(new AttachDefaultsBus()).to.be.an(Bus);
  });

  it("can attach default properties to a running operation", co.wrap(function*() {
    var bus = new AttachDefaultsBus({ c: "d" }, {
      execute: function(operation) {
        return new BufferedResponse(void 0, operation);
      }
    });

    var ret = (yield bus.execute({ a: "b" }).read()).value;

    expect(ret.a).to.be("b");
    expect(ret.c).to.be("d");
  }));

  it("does not override properties on the operation", co.wrap(function*() {
    var bus = new AttachDefaultsBus({ a: 1, c: "d" }, {
      execute: function(operation) {
        return new BufferedResponse(void 0, operation);
      }
    });

    var ret = (yield bus.execute({ a: "b" }).read()).value;

    expect(ret.a).to.be("b");
    expect(ret.c).to.be("d");
  }));
});
