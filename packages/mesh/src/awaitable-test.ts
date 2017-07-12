import { expect } from "chai";
import { readAll } from "./read-all";
import { awaitable } from "./awaitable";

describe(__filename + "#", () => {
  it("can be called", () => {
    awaitable(() => {});
  });
  it("can read all values from awaitable", async () => {
    const a = awaitable(function*() {
      yield 1;
      yield 2;
    });


    expect(await readAll(a())).to.eql([1, 2]);
  });

  it("can await for all values", async () => {
    const a = awaitable(function*() {
      yield 1;
      yield 2;
    });
    expect(await a()).to.eql([1, 2]);
  });
});