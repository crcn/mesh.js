import { expect } from "chai";
import { roundRobin } from ".";

describe(__filename + "#", () => {
  it("can be created", () => {
    roundRobin();
  });

  it("alternates dispatchers each each message, round robin style", async () => {
    const dispatch = roundRobin(
      m => "a",
      m => "b",
      m => "c"
    );

    expect((await dispatch({}).next()).value).to.equal("a");
    expect((await dispatch({}).next()).value).to.equal("b");
    expect((await dispatch({}).next()).value).to.equal("c");
  });
});