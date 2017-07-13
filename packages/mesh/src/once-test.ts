import { once, readAll } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be called", () => {
    once(() => {});
  });

  it("returns all yielded values from target function", async () => {
    const fn = once(function*() {
      yield 1;
      yield 2;
    });

    expect(await readAll(fn())).to.eql([1, 2]);
  });
});