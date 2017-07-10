import { expect } from "chai";
import { tee, readAll, createQueue } from "./index";

describe(__filename + "#", () => {
  it("can tee a async iterable iterator", async () => {
    const input = createQueue();
    input.unshift(1);
    input.unshift(2);
    input.unshift(3);
    input.return();
    const [a, b] = tee(input);
    expect(await readAll(a)).to.eql([1, 2, 3]);
    expect(await readAll(b)).to.eql([1, 2, 3]);
  });
  it("can tee a ateed async iterable iterator", async () => {
    const input = createQueue();
    input.unshift(1);
    input.unshift(2);
    input.unshift(3);
    input.return();
    const [a, b] = tee(input);
    expect(await readAll(a)).to.eql([1, 2, 3]);
    const [c, d] = tee(b);
    expect(await readAll(c)).to.eql([1, 2, 3]);
    const [e, f] = tee(d);
    expect(await readAll(e)).to.eql([1, 2, 3]);
  }); 
});