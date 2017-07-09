import { expect } from "chai";
import { roundRobin } from ".";

describe(__filename + "#", () => {
  it("can be created", () => {
    roundRobin();
  });

  it("alternates functions each each message, round robin style", async () => {
    const fn = roundRobin(
      m => "a",
      m => "b",
      m => "c"
    );

    expect((await fn({}).next()).value).to.equal("a");
    expect((await fn({}).next()).value).to.equal("b");
    expect((await fn({}).next()).value).to.equal("c");
  });
});