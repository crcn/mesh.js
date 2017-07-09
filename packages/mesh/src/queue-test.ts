import { expect } from "chai";
import { timeout } from "./test";
import { createQueue } from "./index";

describe("queue#", () => {
  it("can push & pop items", async function() {
    const queue = createQueue<number>();

    queue.unshift(1);

    expect((await queue.next()).value).to.eql(1);
    
    queue.unshift(2);
    queue.unshift(3);
    expect((await queue.next()).value).to.eql(2);
    expect((await queue.next()).value).to.eql(3);
  });

  it("can use the queue as an async iterable iterator", async function() {
    const queue = createQueue<number>();
    queue.unshift(1);
    queue.unshift(2);
    queue.unshift(3);
    queue.done();

    const buffer = [];
    for await (const value of queue) {
      buffer.push(value);
    }

    expect(buffer).to.eql([1, 2, 3]);
  });
  

  it("next() waits for unshift()", function() {
    const {next, unshift} = createQueue<number>();

    const p = (async (resolve, reject) => {
      expect((await next()).value).to.eql(1);
      expect((await next()).value).to.eql(2);
    })();

    unshift(1);
    unshift(2);

    return p;
  });

  it("push waits for pop", async function() {
    const {next, unshift} = createQueue<number>();
    let c = 0;
    const p = (async () => {
      await unshift(1);
      c++;
      await unshift(2);
      c++;
    })();
    await timeout();
    expect(c).to.eql(0);
    expect(await next()).to.eql({ value: 1, done: false });
    await timeout();
    expect(c).to.eql(1);
    expect(await next()).to.eql({ value: 2, done: false });
    await timeout();
    expect(c).to.eql(2);
  });
});