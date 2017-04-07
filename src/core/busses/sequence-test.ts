import { expect } from "chai";
import { SequenceBus, CallbackDispatcher, ReadableStreamDefaultReader } from "@tandem/mesh";

describe(__filename + "#", () => {
  it("can dispatch a message to multiple endpoints in sequence", async () => {
    let i = 0;

    const bus = new SequenceBus([
      new CallbackDispatcher(m => i++),
      new CallbackDispatcher(m => i++),
      new CallbackDispatcher(m => i++)
    ]);

    const { readable } = bus.dispatch({});
    const reader = readable.getReader() as ReadableStreamDefaultReader<any>;
    expect(i).to.equal(1);
    expect((await reader.read()).value).to.equal(0);
    expect(i).to.equal(1);
    expect((await reader.read()).value).to.equal(1);
    expect(i).to.equal(2);
    expect((await reader.read()).value).to.equal(2);
    expect(i).to.equal(3);
    expect((await reader.read()).done).to.equal(true);
  });
});