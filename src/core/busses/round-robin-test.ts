import { expect } from "chai";
import { DuplexStream, WritableStream, RoundRobinBus, readOneChunk } from "@tandem/mesh";
import { CallbackDispatcher } from "./callback";

describe(__filename + "#", () => {
  it("can be created", () => {
    new RoundRobinBus([]);
  });

  it("alternates busses each each message, round robin style", async () => {
    const bus = new RoundRobinBus([
      new CallbackDispatcher(m => "a"),
      new CallbackDispatcher(m => "b"),
      new CallbackDispatcher(m => "c")
    ]);

    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("a");
    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("b");
    expect((await readOneChunk(bus.dispatch({}))).value).to.equal("c");
  });
});