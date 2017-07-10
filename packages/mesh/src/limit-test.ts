import { expect } from "chai";
import { timeout as _timeout } from "./test";
import { limit, readAll, pipe, through } from "./index";

describe(__filename + "#", () => {
  it("can be created", () => {
    limit(a => a);
  });

  it("can return yielded values by the target function", async () => {
    const fn = limit(() => through((a: number) => a + 1));
    expect(await readAll(pipe([1, 2, 3], fn(1)))).to.eql([2, 3, 4]);
    expect(await readAll(pipe([4, 5, 6], fn(1)))).to.eql([5, 6, 7]);
  });

  it("can limit to one active call", async () => {
    let numCalls = 0;

    const fn = limit(() => numCalls++, 1);
    const i1 = fn();
    const i2 = fn();
    const i3 = fn();
    i2.next();
    await _timeout(1);
    expect(numCalls).to.eql(1);
    i1.next();
    i3.next();
    await _timeout(1);
    expect(numCalls).to.eql(1);
    i2.next();
    await _timeout(1);
    expect(numCalls).to.eql(2);
    i1.next();
    await _timeout(1);
    expect(numCalls).to.eql(3);
  });

  it("can limit to two active calls", async () => {
    let numCalls = 0;

    const fn = limit(() => numCalls++, 2);
    const i1 = fn();
    const i2 = fn();
    const i3 = fn();
    const i4 = fn();
    const i5 = fn();
    i2.next();
    i1.next();
    await _timeout(1);
    expect(numCalls).to.eql(2);
    i3.next();
    i1.next();
    await _timeout(1);
    expect(numCalls).to.eql(3);
    i3.next();
    i2.next();
    i4.next();
    i5.next();
    await _timeout(1);
    expect(numCalls).to.eql(5);
  });
});