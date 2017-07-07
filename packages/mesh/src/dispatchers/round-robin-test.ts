import { expect } from "chai";
import { createRoundRobinDispatcher } from "..";

describe(__filename + "#", () => {
  it("can be created", () => {
    createRoundRobinDispatcher([]);
  });

  it("alternates dispatchers each each message, round robin style", async () => {
    const dispatch = createRoundRobinDispatcher([
      m => "a",
      m => "b",
      m => "c"
    ]);

    expect((await dispatch({}).next()).value).to.equal("a");
    expect((await dispatch({}).next()).value).to.equal("b");
    expect((await dispatch({}).next()).value).to.equal("c");
  });
});