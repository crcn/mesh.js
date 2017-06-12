import { expect } from "chai";
import { CallbackBus } from "./callback";
import { DuplexStream, WritableStream, RoundRobinBus, readOneChunk } from "..";

describe(__filename + "#", () => {
  it("can be created", () => {
    new RoundRobinBus([]);
  });

  it("alternates busses each each message, round robin style", async () => {
    const bus = new RoundRobinBus([
      new CallbackBus(m => "a"),
      new CallbackBus(m => "b"),
      new CallbackBus(m => "c")
    ]);

    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("a");
    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("b");
    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("c");
  });
});