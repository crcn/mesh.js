import { Bus, ReduceBus, BufferedBus } from "../..";
import expect from "expect.js";
import co from "co";

describe(__filename + "#", function() {

  xit("is a bus", function() {
    expect(new ReduceBus()).to.be.an(Bus);
  });

  xit("can reduce many chunks into a single one", co.wrap(function*() {
  }));


});
