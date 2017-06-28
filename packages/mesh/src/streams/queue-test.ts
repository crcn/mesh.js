import { expect } from "chai";
import { createQueue } from "./queue";

describe(__filename + "#", () => {
  it("can push & pop items", async function() {
    const [push, pop] = createQueue<number>();
    push(1);

    expect(await pop()).to.eql(1);
    
    push(2);
    push(3);
    expect(await pop()).to.eql(2);
    expect(await pop()).to.eql(3);
  });
  it("pop waits for push", function() {
    const [push, pop] = createQueue<number>();

    const p = (async (resolve, reject) => {
      expect(await pop()).to.eql(1);
      expect(await pop()).to.eql(2);
    })();

    push(1);
    push(2);

    return p;
  });
  const timeout = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
  it("push waits for pop", async function() {
    const [push, pop] = createQueue<number>();
    let c = 0;
    const p = (async () => {
      await push(1);
      c++;
      await push(2);
      c++;
    })();
    await timeout();
    expect(c).to.eql(0);
    expect(await pop()).to.eql(1);
    await timeout();
    expect(c).to.eql(1);
    expect(await pop()).to.eql(2);
    expect(c).to.eql(2);
  });
});