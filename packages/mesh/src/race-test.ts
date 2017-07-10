import { expect } from "chai";
import { through } from "./through";
import { timeout } from "./test";
import { race, readAll } from "./index";

describe(__filename + "#", () => {
  it("can be called", () => {
    race();
  });
  it("can return yielded values from one function", async () => {
    const fn = race(a => a + 1);
    expect(await readAll(fn(1))).to.eql([2]);
  });
  it("returns one yielded value of multiple called functions", async () => {
    const fn = race(
      a => a + 1,
      b => b + 2,
      c => c + 3,
    );
    expect(await readAll(fn(1))).to.eql([2]);
  });

  it("returns yielded values from the fastest target function", async () => {
    const fn = race(
      a => timeout(100).then(() => a + 1),
      a => timeout(50).then(() => a + 2),
      a => timeout(150).then(() => a + 3),
    );
    expect(await readAll(fn(1))).to.eql([3]);
  });
});