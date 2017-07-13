import { max, readAll } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be called", () => {
    max(() => {});
  });

  it("returns all yielded values from target function", async () => {
    const fn = max(function*() {
      yield 1;
      yield 2;
    });

    expect(await readAll(fn())).to.eql([1, 2]);
  });

  it("stops calling the target function when after first call when max is 1", async () => {
    const fn = max(function*() {
      yield 1;
      yield 2;
    }, 1);

    expect(await readAll(fn())).to.eql([1, 2]);
    expect(await readAll(fn())).to.eql([]);
  });


  it("stops calling the target function when after third call when max is 2", async () => {
    const fn = max(function*() {
      yield 1;
      yield 2;
    }, 2);

    expect(await readAll(fn())).to.eql([1, 2]);
    expect(await readAll(fn())).to.eql([1, 2]);
    expect(await readAll(fn())).to.eql([]);
  });
});